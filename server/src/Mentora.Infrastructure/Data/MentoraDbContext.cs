using Microsoft.EntityFrameworkCore;
using Mentora.Domain.Entities;
using Mentora.Infrastructure.Data.Initializer;

namespace Mentora.Infrastructure.Data;

public class MentoraDbContext(DbContextOptions<MentoraDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Class> Classes { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Course> Courses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MentoraDbContext).Assembly);

        UserInitializer.Initialize(modelBuilder);
    }
}
