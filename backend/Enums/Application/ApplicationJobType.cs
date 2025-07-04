using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace backend.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ApplicationJobType
{
    [EnumMember(Value = "Full Time")]
    FullTime,
    [EnumMember(Value = "Part Time")]
    PartTime,
    Internship,
    Contract
}