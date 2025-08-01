using System.Text.Json;
using backend.Entities;
using backend.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Database;

public class ApplicationConfiguration : IEntityTypeConfiguration<Application>
{
    public void Configure(EntityTypeBuilder<Application> builder)
    {
        builder.HasKey(a => a.Id);
        
        builder.HasIndex(a => a.UserId);

        builder.Property(a => a.UserId)
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(a => a.CompanyName)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(a => a.CompanyEmail)
            .HasMaxLength(255);

        builder.Property(a => a.Position)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.Link)
            .HasMaxLength(2048);

        builder.Property(a => a.Location)
            .HasMaxLength(100);
        
        builder.Property(a => a.Notes)
            .HasMaxLength(5000); 
        
        builder.Property(a => a.JobDescription)
            .HasMaxLength(10000); 

        builder.Property(a => a.Status).HasConversion<string>().HasMaxLength(50);
        builder.Property(a => a.Type).HasConversion<string>().HasMaxLength(50);
        builder.Property(a => a.JobType).HasConversion<string>().HasMaxLength(50);
        builder.Property(a => a.Level).HasConversion<string>().HasMaxLength(50);

        builder.Property(a => a.CreatedAt)
            .IsRequired();
        
        builder.Property(a => a.UpdatedAt)
            .IsRequired(false);
        
        builder.Property(a => a.TechnologiesUsed)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null),
                new ValueComparer<List<string>>(
                    (c1, c2) => c1.SequenceEqual(c2),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()));
        
        builder.HasOne(a => a.User)
            .WithMany(u => u.Applications)
            .HasForeignKey(a => a.UserId)
            .IsRequired();
        
        builder.HasOne(a => a.ResumeUsed)
            .WithMany(r => r.Applications)
            .HasForeignKey(a => a.ResumeId)
            .IsRequired(false);
        
        builder.HasOne(a => a.CoverLetterUsed)
            .WithMany(cl => cl.Applications)
            .HasForeignKey(a => a.CoverLetterId)
            .IsRequired(false);
        
        builder.Property(a => a.IsLiked)
            .IsRequired()
            .HasDefaultValue(false);
    }
}