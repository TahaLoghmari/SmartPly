using Google.Apis.Gmail.v1.Data;

namespace backend.DTOs;

public class PaginatedMessageResponse
{
    public List<Message> Messages { get; set; }
    public string NextPageToken { get; set; }
}