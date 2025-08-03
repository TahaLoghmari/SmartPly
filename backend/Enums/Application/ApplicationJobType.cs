using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;

namespace backend.Enums;

public enum ApplicationJobType
{
    fullTime,
    partTime,
    internship,
    contract
}