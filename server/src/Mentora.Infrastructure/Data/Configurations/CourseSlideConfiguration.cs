using Mentora.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Mentora.Infrastructure.Data.Configurations;

public class CourseSlideConfiguration : IEntityTypeConfiguration<CourseSlide>
{
    public void Configure(EntityTypeBuilder<CourseSlide> entity)
    {
        entity.ToTable("CourseSlides");
        entity.HasKey(e => e.Id);

        entity.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(150);

        entity.Property(e => e.Content)
            .IsRequired()
            .HasColumnType("varchar");

        entity.Property(e => e.SlideTypeId)
            .IsRequired();

        entity.Property(e => e.Ordering)
            .IsRequired();

        entity.Property(e => e.Active)
            .IsRequired();

        entity.Property(e => e.CreatedAt)
            .IsRequired();

        entity.Property(e => e.UpdatedAt)
            .IsRequired();

        entity.HasOne(e => e.Course)
            .WithMany()
            .HasForeignKey(e => e.CourseId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(e => e.SlideType)
            .WithMany()
            .HasForeignKey(e => e.SlideTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
