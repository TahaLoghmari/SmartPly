using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;

namespace backend.Enums;

[JsonConverter(typeof(StringEnumConverter))]
public enum ApplicationType
{
    remote,
    onSite,
    hybrid
}