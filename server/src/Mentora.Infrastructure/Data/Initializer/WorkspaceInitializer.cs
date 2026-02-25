using Mentora.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mentora.Infrastructure.Data.Initializer;

public static class WorkspaceInitializer
{
    public static Workspace Initialize(ModelBuilder modelBuilder)
    {
        var workspace = new Workspace
        {
            Id = new Guid("0097e236-eb5d-4858-9f23-4522833c865c"),
            Name = "Mentora Workspace",
            Active = true,
            CreatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc)
        };
        modelBuilder.Entity<Workspace>().HasData(workspace);
        return workspace;
    }
}