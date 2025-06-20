namespace backend.DTOs;
public class EmailMessageDto
{
    public string Id { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string From { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Snippet { get; set; } = string.Empty;
    public string? Body { get; set; }
}
