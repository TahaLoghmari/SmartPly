using Google.Apis.Gmail.v1.Data;

namespace backend.Utilities;

public static class EmailUtilities
{
    public static string GetHeaderValue(IList<MessagePartHeader> headers, string name)
    {
        return headers.FirstOrDefault(h => h.Name.Equals(name, StringComparison.OrdinalIgnoreCase))?.Value ?? string.Empty;
    }

    public static string ExtractEmailAddress(string fromHeader)
    {
        if (string.IsNullOrEmpty(fromHeader)) return string.Empty;
        
        var match = System.Text.RegularExpressions.Regex.Match(fromHeader, @"<([^>]+)>");
        return match.Success ? match.Groups[1].Value : fromHeader.Trim();
    }

    public static string ExtractDisplayName(string fromHeader)
    {
        if (string.IsNullOrEmpty(fromHeader)) return string.Empty;
        
        var emailIndex = fromHeader.IndexOf('<');
        return emailIndex > 0 ? fromHeader.Substring(0, emailIndex).Trim().Trim('"') : string.Empty;
    }
    
    public static DateTime? ParseHeaderDate(string dateHeader)
    {
        if (string.IsNullOrEmpty(dateHeader)) return null;

        return DateTime.TryParse(dateHeader, out var date) ? date.ToUniversalTime() : null;
    }
}