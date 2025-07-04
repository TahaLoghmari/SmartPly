using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Database.Configuration;

public class ResumeConfiguration : IEntityTypeConfiguration<Resume>
{
    public void Configure(EntityTypeBuilder<Resume> builder)
    {
        builder.HasKey(r => r.Id);
        
        builder.HasMany(r => r.Applications)
            .WithOne(a => a.ResumeUsed)
            .HasForeignKey(a => a.ResumeId)
            .IsRequired(false);
    }
}