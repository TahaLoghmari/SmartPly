namespace backend.DTOs.Application;

public sealed record ApplicationStatsDto
{
    public int TotalWishList { get; init; }
    public int TotalApplied { get; init; }
    public int TotalInterviewing { get; init; }
    public int TotalOffers { get; init; }
    public int TotalRejected { get; init; }
    public int TotalGhosted { get; init; }
};