namespace backend.DTOs;

public class NotificationQueryParameters
{
    public int? Page { get; init; } = 1; 
    public int? PageSize { get; init; } = 10;
}