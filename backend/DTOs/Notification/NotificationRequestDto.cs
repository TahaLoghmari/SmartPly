using backend.Enums;

namespace backend.DTOs;

public record NotificationRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public NotificationType Type { get; set; }  
    public bool IsRead { get; set; } = false ;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}