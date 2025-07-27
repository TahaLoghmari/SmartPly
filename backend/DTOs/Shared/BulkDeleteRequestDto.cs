namespace backend.DTOs.Shared;

public record BulkDeleteRequestDto
{
    public List<Guid> Ids { get; set; }
}