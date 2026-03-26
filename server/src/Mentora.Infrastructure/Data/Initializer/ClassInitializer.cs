using Mentora.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mentora.Infrastructure.Data.Initializer;

public static class ClassInitializer
{
    public static Class Initialize(ModelBuilder modelBuilder, Guid workspaceId, Guid courseId)
    {
           var classEntity = new Class
            {
                Id = new Guid("d1e2f3a4-b5c6-7890-def0-123456789001"),
                Name = "Tecnologia",
                Active = true,
                WorkspaceId = workspaceId,
                CourseId = courseId,
                DateStart = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc),
                DateEnd = new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc),
                CreatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc)
            };
        modelBuilder.Entity<Class>().HasData(classEntity);
        return classEntity;
    }
}
