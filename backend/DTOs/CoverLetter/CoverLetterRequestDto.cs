namespace backend.DTOs;

public class CoverLetterRequestDto
{
    public string Name { get; set; } = string.Empty;
    public IFormFile File { get; set; } = null!;
}

