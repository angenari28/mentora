using Mentora.Application.Interfaces;
using Mentora.Application.Services;
using Mentora.Domain.Interfaces;
using Mentora.Infrastructure.Data;
using Mentora.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Database Configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

Console.WriteLine("=== DEBUG CONNECTION STRING ===");
Console.WriteLine($"Connection String: {connectionString}");
Console.WriteLine($"Connection String: {(string.IsNullOrEmpty(connectionString) ? "VAZIA!" : "OK")}");
Console.WriteLine($"Connection String Length: {connectionString?.Length ?? 0}");
Console.WriteLine("===============================");

if (connectionString?.StartsWith("postgres://") == true || connectionString?.StartsWith("postgresql://") == true)
{
    var uri = new Uri(connectionString);
    var npgsqlConnectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={uri.UserInfo.Split(':')[0]};Password={uri.UserInfo.Split(':')[1]}";
    connectionString = npgsqlConnectionString;

    Console.WriteLine("=== Connection String convertida de URL para Npgsql ===");
    Console.WriteLine($"Connection String: {connectionString}");
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
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MentoraDbContext>();
    dbContext.Database.Migrate();
}

app.Run();
