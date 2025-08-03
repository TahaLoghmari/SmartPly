namespace backend.Entities;

public abstract class FileEntity
{
    public string Name { get; set; }
    public string Url { get; set; }
    public long Size { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
}