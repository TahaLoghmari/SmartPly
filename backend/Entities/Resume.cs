namespace backend.Entities;

public class Resume
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Name { get; set; }
    
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}