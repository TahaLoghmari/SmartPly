namespace backend.Entities;

public sealed class HangfireJob
{
    public string UserId { get; set; }
    public string HangfireJobId { get; set; }
    public User? User { get; set; }
}