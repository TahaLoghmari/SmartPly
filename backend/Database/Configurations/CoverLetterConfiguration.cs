using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Database;

public class CoverLetterConfiguration : IEntityTypeConfiguration<CoverLetter>
{
    public void Configure(EntityTypeBuilder<CoverLetter> builder)
    {
        builder.HasIndex(cl => cl.UserId);
        
        builder.HasKey(cl => cl.Id);
        
        builder.Property(cl => cl.Url)
            .IsRequired()
            .HasMaxLength(512);
        
        builder.Property(cl => cl.Size)
            .IsRequired()
            .HasMaxLength(32);
        
        builder.HasMany(cl => cl.Applications)
            .WithOne(a => a.CoverLetterUsed)
            .HasForeignKey(a => a.CoverLetterId)
            .IsRequired(false);
        
        builder.HasOne(cl => cl.User)
            .WithMany(u => u.CoverLetters)
            .HasForeignKey(cl => cl.UserId)
            .IsRequired();
    }
}