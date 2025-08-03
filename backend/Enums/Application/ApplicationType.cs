using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;

namespace backend.Enums;

public enum ApplicationType
{
    remote,
    onSite,
    hybrid
}