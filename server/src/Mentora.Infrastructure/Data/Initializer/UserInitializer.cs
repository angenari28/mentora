using Mentora.Domain.Entities;
using Mentora.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Mentora.Infrastructure.Data.Initializer;

public static class UserInitializer
{
    public static List<User> Initialize(ModelBuilder modelBuilder, Guid WorkspaceId = default)
    {
        var users = new List<User>
        {
            new ()
            {
                Id = new Guid("935580d8-2fd7-4113-ba2b-b5034bf64112"),
                Email = "master@email.com",
                Name = "Master Administrador",
                PasswordHash = "AAAAAAAAAAAAAAAAAAAAAA==.Su9Ho03CNSLtGNeCDZyJlSdYk1UEJ0BXEy5uTE8cKXo=",
                Role = UserRoleEnum.Master,
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
                LastLoginAt = null,
                WorkspaceId = WorkspaceId
            },
            new ()
            {
                Id = new Guid("e1f2a3b4-c5d6-7890-ef01-234567890001"),
                Email = "andre@email.com",
                Name = "Andre Genari",
                PasswordHash = "nJEt6jds6iAP612V325Rkg==.zwkNj4/nrFV44syzfeKqbgmt8Qn9o5ZBBpvc2eoW7ho=",
                Role = UserRoleEnum.Student,
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
                LastLoginAt = null,
                WorkspaceId = WorkspaceId
            },
            new ()
            {
                Id = new Guid("f2a3b4c5-d6e7-8901-f023-456789000002"),
                Email = "painel@email.com",
                Name = "Painel",
                PasswordHash = "aUbY3VWTfZgbydlHIJY63w==.V8jOFtonbdsr+9LiyYLqvoB93BpznQVtB3DAX4NyQ0E=",
                Role = UserRoleEnum.Administrator,
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
                LastLoginAt = null,
                WorkspaceId = WorkspaceId
            }
        };
        modelBuilder.Entity<User>().HasData(users);
        return users;
    }
}