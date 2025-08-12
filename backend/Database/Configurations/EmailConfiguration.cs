using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Database;

public class EmailConfiguration : IEntityTypeConfiguration<Email>
{
    public void Configure(EntityTypeBuilder<Email> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(e => e.UserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.Property(e => e.Subject)
            .HasMaxLength(1000);

        builder.Property(e => e.FromAddress)
            .HasMaxLength(256);

        builder.Property(e => e.FromName)
            .HasMaxLength(256);

        builder.Property(e => e.Labels)
            .HasColumnType("text");

        builder.Property(e => e.Snippet)
            .HasMaxLength(10000);

        builder.Property(e => e.InternalDate);

        builder.Property(e => e.CreatedAt)
            .IsRequired();

        builder.Property(e => e.UpdatedAt)
            .IsRequired();

        builder.HasOne(e => e.User)
            .WithMany(u => u.Emails)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.UserId);
        builder.HasIndex(e => e.InternalDate);
        builder.HasIndex(e => new { e.UserId, e.HeaderDate });
    }
}