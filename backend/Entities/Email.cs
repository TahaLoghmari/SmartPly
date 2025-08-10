using Google.Apis.Gmail.v1.Data;

namespace backend.Entities;

public class Email
{
    public string Id { get; set; } = string.Empty;
    public string? UserId { get; set; } 
    public ulong? HistoryId { get; set; }
    public string ThreadId { get; set; } = string.Empty;
    public long? InternalDate { get; set; }
    public IList<string>? LabelIds { get; set; }
    public MessagePart? Payload { get; set; }
    public string? Raw { get; set; }
    public int? SizeEstimate { get; set; }
    public string Snippet { get; set; } = string.Empty;
    public string Etag { get; set; } = string.Empty;
    public User? User { get; init; } 
}

