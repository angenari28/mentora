using Mentora.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Mentora.Infrastructure.Data.Configurations;

public class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> entity)
    {
        entity.ToTable("Courses");
        entity.HasKey(e => e.Id);

        entity.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(150);

        entity.Property(e => e.ShowCertificate)
            .IsRequired();

        entity.Property(e => e.Active)
            .IsRequired();

        entity.Property(e => e.FaceImage)
            .IsRequired()
            .HasMaxLength(45);

        entity.Property(e => e.CertificateImage)
            .IsRequired()
            .HasMaxLength(45);

        entity.Property(e => e.WorkloadHours)
            .IsRequired();

        entity.Property(e => e.CreatedAt)
            .IsRequired();

        entity.Property(e => e.UpdatedAt)
            .IsRequired();

        entity.HasOne(e => e.Category)
            .WithMany()
            .HasForeignKey(e => e.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
