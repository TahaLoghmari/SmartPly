using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;

namespace backend.Enums;

public enum ApplicationStatus
{
    wishList,
    applied,
    interview,
    offer,
    rejected,
    ghosted,
}