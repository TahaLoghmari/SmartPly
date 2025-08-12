namespace backend.Entities;

public class Email
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public long? InternalDate { get; set; }
    public DateTime? HeaderDate { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string FromAddress { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;
    public string Labels { get; set; } = string.Empty; 
    public string Snippet { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public bool IsImportant { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public User? User { get; set; }
}