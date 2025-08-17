using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Database;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(u => u.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.GoogleEmail)
            .IsRequired(false)
            .HasMaxLength(200);

        builder.Property(u => u.ImageUrl)
            .IsRequired(false)
            .HasMaxLength(500);

        builder.Property(u => u.GmailConnected)
            .IsRequired(false)
            .HasDefaultValue(false);
        
        builder.Property(u => u.LastSyncedAt)
            .IsRequired(false);
        
        builder.Property(u => u.IsInitialSyncComplete)
            .IsRequired()
            .HasDefaultValue(false);
        
        builder.Property(u => u.IsInitialSyncStarted)
            .IsRequired()
            .HasDefaultValue(false);
        
        builder.Property(u => u.IsRecurringSyncScheduled)
            .IsRequired()
            .HasDefaultValue(false);
        
        builder.Property(u => u.IsRecurringCleanupScheduled)
            .IsRequired()
            .HasDefaultValue(false);

        builder.HasMany(u => u.Emails)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasMany(u => u.Applications)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.Resumes)
            .WithOne(r => r.User)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.CoverLetters)
            .WithOne(c => c.User)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasIndex(u => u.Name);
    }
}