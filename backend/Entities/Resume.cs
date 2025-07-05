namespace backend.Entities;

public class Resume
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string UserId { get; set; } 
    public required string Name { get; set; }
    public required int ApplicationsCount { get; set; } = 0;
    public required int InterviewsCount { get; init; } = 0;
    
    public ICollection<Application>? Applications { get; set; } = new List<Application>();
}