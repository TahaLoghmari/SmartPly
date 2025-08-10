using System.Text.Json;
using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace backend.Database;

public class EmailConfiguration : IEntityTypeConfiguration<Email>
{
    public void Configure(EntityTypeBuilder<Email> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(e => e.ThreadId)
            .HasMaxLength(128);

        builder.Property(e => e.HistoryId);

        builder.Property(e => e.InternalDate);

        builder.Property(e => e.LabelIds)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<IList<string>>(v, (JsonSerializerOptions)null),
                new ValueComparer<IList<string>>(
                    (c1, c2) => c1.SequenceEqual(c2),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()));

        builder.Property(e => e.SizeEstimate);

        builder.Property(e => e.Snippet)
            .HasMaxLength(10000);

        builder.Property(e => e.Etag)
            .HasMaxLength(255);

        builder.Ignore(e => e.Payload);
        builder.Ignore(e => e.Raw);     
    }
}