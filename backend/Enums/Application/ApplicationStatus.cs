using System.Text.Json.Serialization;

namespace backend.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ApplicationStatus
{
    WishList,
    Applied,
    Interviewing,
    Offer,
    Rejected,
    Ghosted
}