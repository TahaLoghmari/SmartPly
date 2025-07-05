namespace backend.Entities;

public class Contact
{
    public Guid? Id { get; set; } = Guid.NewGuid();
    public string? Name { get; set; }
    
}