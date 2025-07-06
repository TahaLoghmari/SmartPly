namespace backend.Entities;

public class CoverLetter
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Name { get; set; }
    public string UserId { get; set; } 
    
    public User? User { get; init; }
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}