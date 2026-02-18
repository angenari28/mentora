using Mentora.Domain.Entities;
using Mentora.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Mentora.Infrastructure.Data.Initializer;

public static class UserInitializer
{
    public static void Initialize(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Email = "master@email.com",
                Name = "Master Administrador",
                Role = UserRole.Master,
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
                LastLoginAt = null
            }
        );
    }
}