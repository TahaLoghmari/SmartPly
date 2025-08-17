namespace backend.DTOs;

public sealed record UserDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; } 
    public string? GoogleEmail { get; set; }
    public string? ImageUrl { get; set; }
    public bool? GmailConnected { get; set; }
    public bool? HasPassword { get; set; }
    public bool IsInitialSyncComplete { get; set; }
}