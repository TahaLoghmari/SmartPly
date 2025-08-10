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
}