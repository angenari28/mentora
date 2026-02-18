using Mentora.Application.Interfaces;
using Mentora.Application.Services;
using Mentora.Domain.Interfaces;
using Mentora.Infrastructure.Data;
using Mentora.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.IO;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Database Configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

Console.WriteLine("connectionString after conversion: " + connectionString);

// Converter URL do PostgreSQL para formato Npgsql
if (!string.IsNullOrEmpty(connectionString) &&
    (connectionString.StartsWith("postgres://") || connectionString.StartsWith("postgresql://")))
{
    try
    {
        var uri = new Uri(connectionString);
        var userInfo = uri.UserInfo.Split(':');
        connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
        Console.WriteLine("connectionString after conversion: " + connectionString);
        Console.WriteLine("✓ Connection string convertida de URL para Npgsql format");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"✗ Erro ao converter connection string: {ex.Message}");
        throw;
    }
}

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' não configurada.");
}

builder.Services.AddDbContext<MentoraDbContext>(options =>
    options.UseNpgsql(connectionString));

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:4200",
            "https://mentora-cyan.vercel.app",
            "https://*.vercel.app"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Application Services
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

if (!app.Environment.IsProduction())
    app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();

if (ShouldAutoCreateMigrations(app.Environment))
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<MentoraDbContext>();
    try
    {
        Console.WriteLine("Verificando alteracoes no modelo para migrations...");
        AutoCreateMigrationIfNeeded(dbContext, app.Environment.ContentRootPath);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"✗ Erro ao gerar migration automaticamente: {ex.Message}");
    }
}

// Apply migrations
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MentoraDbContext>();
    try
    {
        Console.WriteLine("Aplicando migrations...");
        dbContext.Database.Migrate();
        Console.WriteLine("✓ Migrations aplicadas com sucesso!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"✗ Erro ao aplicar migrations: {ex.Message}");
        throw;
    }
}

app.Run();

static bool ShouldAutoCreateMigrations(IHostEnvironment env)
{
    var flag = Environment.GetEnvironmentVariable("AUTO_MIGRATIONS");
    if (!string.IsNullOrWhiteSpace(flag))
    {
        return bool.TryParse(flag, out var enabled) && enabled;
    }

    return env.IsDevelopment();
}

static void AutoCreateMigrationIfNeeded(MentoraDbContext dbContext, string apiContentRoot)
{
    var serverRoot = Path.GetFullPath(Path.Combine(apiContentRoot, "..", ".."));
    var migrationsDir = Path.Combine(serverRoot, "src", "Mentora.Infrastructure", "Migrations");

    Directory.CreateDirectory(migrationsDir);

    var preFiles = Directory.EnumerateFiles(migrationsDir, "*.cs", SearchOption.TopDirectoryOnly)
        .Select(Path.GetFileName)
        .ToHashSet(StringComparer.OrdinalIgnoreCase);

    var preMainMigrations = preFiles.Where(f => !f.EndsWith(".Designer.cs", StringComparison.OrdinalIgnoreCase)
        && !f.EndsWith("ModelSnapshot.cs", StringComparison.OrdinalIgnoreCase))
        .ToList();

    var preMainCount = preMainMigrations.Count;

    var nextSequence = GetNextMigrationSequence(migrationsDir, dbContext);
    var migrationName = $"Incremental_{nextSequence:0000}";
    var args = $"ef migrations add {migrationName} --project src/Mentora.Infrastructure --startup-project src/Mentora.API";

    var result = RunProcess("dotnet", args, serverRoot);

    if (result.ExitCode != 0)
    {
        if (!string.IsNullOrWhiteSpace(result.Error) && result.Error.Contains("No changes were detected", StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine("Nenhuma mudanca detectada; nenhuma migration criada.");
            return;
        }

        throw new InvalidOperationException($"dotnet ef falhou: {result.Error}");
    }

    var postFiles = Directory.EnumerateFiles(migrationsDir, "*.cs", SearchOption.TopDirectoryOnly)
        .Select(Path.GetFileName)
        .ToHashSet(StringComparer.OrdinalIgnoreCase) ?? throw new InvalidOperationException("Falha ao enumerar arquivos de migração.");

    var newMainMigrations = postFiles.Where(f => !preFiles.Contains(f)
        && !f.EndsWith(".Designer.cs", StringComparison.OrdinalIgnoreCase)
        && !f.EndsWith("ModelSnapshot.cs", StringComparison.OrdinalIgnoreCase))
        .ToList();

    if (newMainMigrations.Count <= 0)
        return;

    foreach (var migrationFileName in newMainMigrations)
    {
        if(string.IsNullOrEmpty(migrationFileName)) continue;

        var mainPath = Path.Combine(migrationsDir, migrationFileName);
        if (IsMigrationEmpty(mainPath))
        {
            Console.WriteLine($"Migration {migrationFileName} vazia detectada; removendo.");

            var designerPath = Path.ChangeExtension(mainPath, ".Designer.cs");
            if (File.Exists(mainPath)) File.Delete(mainPath);
            if (File.Exists(designerPath)) File.Delete(designerPath);

            // Se nao havia migrations antes, removemos o snapshot para manter consistente
            var snapshotPath = Path.Combine(migrationsDir, "MentoraDbContextModelSnapshot.cs");
            if (preMainCount == 0 && File.Exists(snapshotPath))
            {
                File.Delete(snapshotPath);
            }
        }
    }
}

static int GetNextMigrationSequence(string migrationsDir, MentoraDbContext dbContext)
{
    var maxSequence = 0;

    foreach (var migrationId in dbContext.Database.GetAppliedMigrations())
    {
        var seq = ParseSequence(migrationId);
        maxSequence = Math.Max(maxSequence, seq);
    }

    var files = Directory.EnumerateFiles(migrationsDir, "*.cs", SearchOption.TopDirectoryOnly)
        .Where(file => !file.EndsWith(".Designer.cs", StringComparison.OrdinalIgnoreCase)
            && !file.EndsWith("ModelSnapshot.cs", StringComparison.OrdinalIgnoreCase));

    foreach (var file in files)
    {
        var name = Path.GetFileNameWithoutExtension(file);
        var seq = ParseSequence(name);
        maxSequence = Math.Max(maxSequence, seq);
    }

    return maxSequence + 1;
}

static int ParseSequence(string migrationId)
{
    var parts = migrationId.Split('_');
    if (parts.Length < 2)
    {
        return 0;
    }

    return int.TryParse(parts[^1], out var seq) ? seq : 0;
}

static bool IsMigrationEmpty(string migrationPath)
{
    var text = File.ReadAllText(migrationPath);
    return !text.Contains("migrationBuilder.", StringComparison.Ordinal);
}

static (int ExitCode, string Output, string Error) RunProcess(string fileName, string arguments, string workingDirectory)
{
    using var process = new Process();
    process.StartInfo = new ProcessStartInfo
    {
        FileName = fileName,
        Arguments = arguments,
        WorkingDirectory = workingDirectory,
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        UseShellExecute = false,
        CreateNoWindow = true
    };

    process.Start();
    var output = process.StandardOutput.ReadToEnd();
    var error = process.StandardError.ReadToEnd();
    process.WaitForExit();

    return (process.ExitCode, output, error);
}