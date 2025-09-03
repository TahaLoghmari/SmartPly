using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Database;

public sealed class HangfireJobConfiguration : IEntityTypeConfiguration<HangfireJob>
{
    public void Configure(EntityTypeBuilder<HangfireJob> builder)
    {
        builder.HasKey(x => x.HangfireJobId);
        
        builder.Property(x => x.UserId).IsRequired().HasMaxLength(128);
        builder.Property(x => x.HangfireJobId).IsRequired().HasMaxLength(128);
        
        builder.HasOne(x => x.User)
            .WithMany(u => u.HangfireJobs)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}