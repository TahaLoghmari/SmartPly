namespace backend.Entities;

public class CoverLetter : FileEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; } 
    public User? User { get; init; }
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}