using Mentora.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mentora.Infrastructure.Data.Initializer;

public static class SlideTypeInitializer
{
    public static void Initialize(ModelBuilder modelBuilder)
    {
        var now = new DateTime(2026, 3, 11, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<SlideType>().HasData(
            new SlideType
            {
                Id = new Guid("a1b2c3d4-0001-0000-0000-000000000001"),
                Name = "Texto",
                Icon = string.Empty,
                Active = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new SlideType
            {
                Id = new Guid("a1b2c3d4-0001-0000-0000-000000000002"),
                Name = "Imagem",
                Icon = string.Empty,
                Active = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new SlideType
            {
                Id = new Guid("a1b2c3d4-0001-0000-0000-000000000003"),
                Name = "PPT",
                Icon = string.Empty,
                Active = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new SlideType
            {
                Id = new Guid("a1b2c3d4-0001-0000-0000-000000000004"),
                Name = "Vídeo",
                Icon = string.Empty,
                Active = true,
                CreatedAt = now,
                UpdatedAt = now
            }
        );
    }
}
