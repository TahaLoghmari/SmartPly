namespace backend.DTOs;

public record EmailQueryParameters
{
    public int? Page { get; init; } = 1; 
    public bool jobEmail { get; init; } = false;
    public int? PageSize { get; init; } = 10;
}