using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Database.Configurations;

public class ResumeConfiguration : IEntityTypeConfiguration<Resume>
{
    public void Configure(EntityTypeBuilder<Resume> builder)
    {
        builder.HasIndex(r => r.UserId);
        
        builder.HasKey(r => r.Id);
        
        builder.Property(r => r.resumeUrl)
            .IsRequired()
            .HasMaxLength(512);
        
        builder.HasMany(r => r.Applications)
            .WithOne(a => a.ResumeUsed)
            .HasForeignKey(a => a.ResumeId)
            .IsRequired(false);
        
        builder.HasOne(r => r.User)
            .WithMany(u => u.Resumes)
            .HasForeignKey(r => r.UserId)
            .IsRequired();
    }
}