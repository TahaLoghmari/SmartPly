using backend.Enums;

namespace backend.Entities;

public record Notification
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public NotificationType Type { get; set; }  
    // Add other properties as needed
    public bool IsRead { get; set; } = false ;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid? ApplicationId { get; set; }
    public User? User { get; set; }
    public Application? Application { get; set; }
}