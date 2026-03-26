using Mentora.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Mentora.Infrastructure.Data.Configurations;

public class CourseSlideTimeConfiguration : IEntityTypeConfiguration<CourseSlideTime>
{
    public void Configure(EntityTypeBuilder<CourseSlideTime> entity)
    {
        entity.ToTable("CourseSlidesTimes");
        entity.HasKey(e => e.Id);

        entity.Property(e => e.UserId)
            .IsRequired();

        entity.Property(e => e.CourseSlideId)
            .IsRequired();

        entity.Property(e => e.DateStart)
            .IsRequired();

        entity.Property(e => e.DateEnd)
            .IsRequired();

        entity.Property(e => e.CreatedAt)
            .IsRequired();

        entity.Property(e => e.UpdatedAt)
            .IsRequired();

        entity.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(e => e.CourseSlide)
            .WithMany()
            .HasForeignKey(e => e.CourseSlideId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
