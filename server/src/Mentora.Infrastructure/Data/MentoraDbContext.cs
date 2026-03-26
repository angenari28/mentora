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
    public DbSet<Workspace> Workspaces { get; set; }
    public DbSet<ClassStudent> ClassStudents { get; set; }
    public DbSet<CourseSlide> CourseSlides { get; set; }
    public DbSet<CourseSlideTime> CourseSlidesTimes { get; set; }
    public DbSet<SlideType> SlideTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MentoraDbContext).Assembly);

        var workspace = WorkspaceInitializer.Initialize(modelBuilder);
        UserInitializer.Initialize(modelBuilder, workspace.Id);
        SlideTypeInitializer.Initialize(modelBuilder);
    }
}
