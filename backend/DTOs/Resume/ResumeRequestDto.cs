namespace backend.DTOs.Resume;

public class ResumeRequestDto
{
    public string Name { get; set; }
    public IFormFile File { get; set; }
}