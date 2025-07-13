using backend.Enums;

namespace backend.DTOs.Application;

public sealed record ApplicationQueryParameters
{
    public string? Search { get; set; }
    public ApplicationStatus? Status { get; init; }
    public ApplicationLevel? Level { get; init; }
    public ApplicationType? Type { get; init; }
    public ApplicationJobType? JobType { get; init; }
};