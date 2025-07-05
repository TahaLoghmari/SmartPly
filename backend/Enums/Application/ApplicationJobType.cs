using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace backend.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ApplicationJobType
{
    fullTime,
    partTime,
    internship,
    contract
}