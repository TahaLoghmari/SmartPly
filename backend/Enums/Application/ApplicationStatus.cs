using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;

namespace backend.Enums;

[JsonConverter(typeof(StringEnumConverter))]
public enum ApplicationStatus
{
    wishList,
    applied,
    interview,
    offer,
    rejected,
    ghosted
}