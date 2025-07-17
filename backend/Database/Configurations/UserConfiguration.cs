using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Database.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(u => u.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.ImageUrl)
            .IsRequired(false)
            .HasMaxLength(500);
        builder.Property(u => u.GmailConnected)
            .IsRequired(false)
            .HasDefaultValue(false);
    }
}