namespace backend.Entities;

public class Resume
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; } 
    public string Name { get; set; }
    public int ApplicationsCount { get; set; } = 0;
    public int InterviewsCount { get; init; } = 0;
    
    public User? User { get; init; }
    public ICollection<Application>? Applications { get; set; } = new List<Application>();
}