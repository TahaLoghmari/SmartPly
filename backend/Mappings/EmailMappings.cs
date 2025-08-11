using backend.Entities;
using Google.Apis.Gmail.v1.Data;

namespace backend.Mappings;

internal static class EmailMappings
{
    public static Email MapToEmailEntity( Message message, string userId)
    {
        return new Email
        {
            UserId = userId,
            Id  = message.Id,
            HistoryId = message.HistoryId,
            ThreadId = message.ThreadId,
            InternalDate = message.InternalDate,
            LabelIds = message.LabelIds,
            Payload = message.Payload,
            Raw = message.Raw,
            SizeEstimate = message.SizeEstimate,
            Snippet = message.Snippet,
            Etag = message.ETag
        };
    }
    public static void UpdateEmailEntity(Email existing, Email updated)
    {
        existing.HistoryId = updated.HistoryId;
        existing.ThreadId = updated.ThreadId;
        existing.InternalDate = updated.InternalDate;
        existing.LabelIds = updated.LabelIds;
        existing.Payload = updated.Payload;
        existing.Raw = updated.Raw;
        existing.SizeEstimate = updated.SizeEstimate;
        existing.Snippet = updated.Snippet;
        existing.Etag = updated.Etag;
    }
}