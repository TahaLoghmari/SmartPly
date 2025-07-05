using System.Text.Json.Serialization;

namespace backend.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ApplicationStatus
{
    wishList,
    applied,
    interviewing,
    offer,
    rejected,
    ghosted
}