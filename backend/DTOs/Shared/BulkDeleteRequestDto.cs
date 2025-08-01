namespace backend.DTOs;

public record BulkDeleteRequestDto
{
    public List<Guid> Ids { get; set; }
}