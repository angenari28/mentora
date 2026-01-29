using Mentora.Application.Interfaces;
using Mentora.Application.Services;
using Mentora.Domain.Interfaces;
using Mentora.Infrastructure.Data;
using Mentora.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

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
            "https://mentora.vercel.app",
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