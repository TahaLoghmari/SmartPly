using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;

namespace backend.Enums;

[JsonConverter(typeof(StringEnumConverter))]
public enum ApplicationJobType
{
    fullTime,
    partTime,
    internship,
    contract
}