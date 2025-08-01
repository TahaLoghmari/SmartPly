namespace backend.DTOs;

public class ResumeRequestDto
{
    public string Name { get; set; }
    public IFormFile File { get; set; }
}