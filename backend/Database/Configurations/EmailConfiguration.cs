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
            .HasMaxLength(255)
            .IsRequired();
            
        builder.Property(e => e.UserId)
            .HasMaxLength(255)
            .IsRequired();
            
        builder.Property(e => e.Subject)
            .HasMaxLength(1000)
            .IsRequired();
            
        builder.Property(e => e.FromAddress)
            .HasMaxLength(500)
            .IsRequired();
            
        builder.Property(e => e.FromName)
            .HasMaxLength(500)
            .IsRequired();
            
        builder.Property(e => e.Labels)
            .HasColumnType("TEXT")
            .IsRequired();
            
        builder.Property(e => e.Snippet)
            .HasColumnType("TEXT")
            .HasMaxLength(500)
            .IsRequired();
            
        builder.Property(e => e.HeaderDate)
            .HasMaxLength(100);
            
        builder.Property(e => e.IsRead)
            .IsRequired();

        builder.Property(e => e.Category)
            .HasMaxLength(255);

        builder.Property(e => e.Summary)
            .HasColumnType("TEXT")
            .HasMaxLength(500);
        
        builder.Property(e => e.IsJobRelated)
            .IsRequired()
            .HasDefaultValue(false);
            
        builder.Property(e => e.IsImportant)
            .IsRequired();
            
        builder.Property(e => e.CreatedAt)
            .IsRequired();
            
        builder.Property(e => e.UpdatedAt)
            .IsRequired();
            
        builder.HasOne(e => e.User)
            .WithMany(u => u.Emails)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasIndex(e => e.UserId);
        builder.HasIndex(e => e.IsRead);
        builder.HasIndex(e => e.IsImportant);
        builder.HasIndex(e => e.CreatedAt);
    }
}