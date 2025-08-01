using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Database;

public class ResumeConfiguration : IEntityTypeConfiguration<Resume>
{
    public void Configure(EntityTypeBuilder<Resume> builder)
    {
        builder.HasIndex(r => r.UserId);
        
        builder.HasKey(r => r.Id);
        
        builder.Property(r => r.ResumeUrl)
            .IsRequired()
            .HasMaxLength(512);
        
        builder.Property(r => r.Size)
            .IsRequired()
            .HasMaxLength(32);
        
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