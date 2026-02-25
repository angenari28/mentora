using Mentora.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Mentora.Infrastructure.Data.Configurations;

public class WorkspaceConfiguration : IEntityTypeConfiguration<Workspace>
{
    public void Configure(EntityTypeBuilder<Workspace> entity)
    {
        entity.ToTable("Workspaces");
        entity.HasKey(e => e.Id);

        entity.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(20);

        entity.Property(e => e.Logo)
            .IsRequired()
            .HasMaxLength(50);

        entity.Property(e => e.PrimaryColor)
            .IsRequired()
            .HasMaxLength(10);

        entity.Property(e => e.SecondaryColor)
            .IsRequired()
            .HasMaxLength(10);

        entity.Property(e => e.BigBanner)
            .IsRequired()
            .HasMaxLength(50);

        entity.Property(e => e.SmallBanner)
            .IsRequired()
            .HasMaxLength(50);

        entity.Property(e => e.Active)
            .IsRequired();

        entity.Property(e => e.Url)
            .IsRequired()
            .HasColumnType("varchar");

        entity.Property(e => e.CreatedAt)
            .IsRequired();

        entity.Property(e => e.UpdatedAt)
            .IsRequired();
    }
}
