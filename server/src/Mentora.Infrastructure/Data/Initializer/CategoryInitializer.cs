using Mentora.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mentora.Infrastructure.Data.Initializer;

public static class CategoryInitializer
{
    public static Category Initialize(ModelBuilder modelBuilder, Guid workspaceId)
    {
        var category = new Category
        {
            Id = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
            Name = "Tecnologia",
            Active = true,
            WorkspaceId = workspaceId,
            CreatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc)
        };
        modelBuilder.Entity<Category>().HasData(category);
        return category;
    }
}
