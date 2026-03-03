using Mentora.Domain.Entities;
using Mentora.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Mentora.Infrastructure.Data.Initializer;

public static class UserInitializer
{
    public static void Initialize(ModelBuilder modelBuilder, Guid WorkspaceId = default)
    {
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = new Guid("935580d8-2fd7-4113-ba2b-b5034bf64112"),
                Email = "master@email.com",
                Name = "Master Administrador",
                PasswordHash = "AAAAAAAAAAAAAAAAAAAAAA==.Su9Ho03CNSLtGNeCDZyJlSdYk1UEJ0BXEy5uTE8cKXo=",
                Role = UserRole.Master,
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
                LastLoginAt = null,
                WorkspaceId = WorkspaceId
            }
        );
    }
}