namespace backend.Entities;

public class Resume
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; } 
    public string Name { get; set; }
    public string ResumeUrl { get; set; }
    public long Size { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public User? User { get; init; }
    public ICollection<Application>? Applications { get; set; } = new List<Application>();
}