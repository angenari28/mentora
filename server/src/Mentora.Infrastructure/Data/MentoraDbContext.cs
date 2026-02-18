using Microsoft.EntityFrameworkCore;
using Mentora.Domain.Entities;
using Mentora.Infrastructure.Data.Initializer;

namespace Mentora.Infrastructure.Data;

public class MentoraDbContext(DbContextOptions<MentoraDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Class> Classes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Role)
                .IsRequired()
                .HasConversion<int>();

            entity.Property(e => e.IsActive)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt)
                .IsRequired();

            entity.HasIndex(e => e.Email)
                .IsUnique();
        });

        modelBuilder.Entity<Class>(entity =>
        {
            entity.ToTable("Classes");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.DateStart)
                .IsRequired();

            entity.Property(e => e.DateEnd)
                .IsRequired();

            entity.Property(e => e.Active)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt)
                .IsRequired();
        });

        UserInitializer.Initialize(modelBuilder);
    }
}
