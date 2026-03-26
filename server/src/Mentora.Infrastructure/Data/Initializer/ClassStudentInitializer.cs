using Mentora.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mentora.Infrastructure.Data.Initializer;

public static class ClassStudentInitializer
{

    public static void Initialize(ModelBuilder modelBuilder, Guid userId, Guid classId)
        =>
        modelBuilder.Entity<ClassStudent>().HasData(
            new ClassStudent
            {
                Id = new Guid("f1a2b3c4-d5e6-7890-f012-345678900001"),
                UserId = userId,
                ClassId = classId,
                Active = true,
                CreatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc)
            }
        );
}
