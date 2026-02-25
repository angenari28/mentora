using Mentora.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Mentora.Infrastructure.Data.Configurations;

public class SlideTypeConfiguration : IEntityTypeConfiguration<SlideType>
{
    public void Configure(EntityTypeBuilder<SlideType> entity)
    {
        entity.ToTable("SlideTypes");
        entity.HasKey(e => e.Id);

        entity.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(30);

        entity.Property(e => e.Icon)
            .IsRequired()
            .HasMaxLength(30);

        entity.Property(e => e.Active)
            .IsRequired();

        entity.Property(e => e.CreatedAt)
            .IsRequired();

        entity.Property(e => e.UpdatedAt)
            .IsRequired();
    }
}
