using System.Text;
using backend.Entities;
using backend.Enums;
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
    
    public static string? GetDecodedEmailBody(Message fullEmail)
    {
        if (fullEmail.Payload == null)
            return null;

        string DecodeBase64Url(string base64Url)
        {
            string padded = base64Url.Replace('-', '+').Replace('_', '/');
            switch (padded.Length % 4)
            {
                case 2: padded += "=="; break;
                case 3: padded += "="; break;
            }
            var bytes = Convert.FromBase64String(padded);
            return Encoding.UTF8.GetString(bytes);
        }

        string? FindBody(IList<MessagePart>? parts)
        {
            if (parts == null) return null;
            foreach (var part in parts)
            {
                if (part.MimeType == "text/plain" && part.Body?.Data != null)
                    return DecodeBase64Url(part.Body.Data);
                if (part.MimeType == "text/html" && part.Body?.Data != null)
                    return DecodeBase64Url(part.Body.Data);
                var result = FindBody(part.Parts);
                if (result != null) return result;
            }
            return null;
        }

        if (fullEmail.Payload.Body?.Data != null)
            return DecodeBase64Url(fullEmail.Payload.Body.Data);
        
        return FindBody(fullEmail.Payload.Parts);
    }
    
    public static string CleanJsonResponse(string rawResponse)
    {
        if (string.IsNullOrWhiteSpace(rawResponse))
            return rawResponse;

        rawResponse = rawResponse.Trim();

        // If wrapped in ```json ... ```
        if (rawResponse.StartsWith("```"))
        {
            int firstNewline = rawResponse.IndexOf('\n');
            int lastFence = rawResponse.LastIndexOf("```");

            if (firstNewline != -1 && lastFence != -1)
            {
                rawResponse = rawResponse.Substring(firstNewline + 1, lastFence - firstNewline - 1).Trim();
            }
        }

        return rawResponse;
    }
    
    public static NotificationType MapCategoryToNotificationType(string? category)
    {
        if (string.IsNullOrWhiteSpace(category))
            return NotificationType.otherUpdate;

        switch (category.Trim().ToLowerInvariant())
        {
            case "interview":
                return NotificationType.interview;
            case "offer":
                return NotificationType.offer;
            case "applied":
                return NotificationType.applied;
            case "rejected":
                return NotificationType.rejected;
            case "emailUpdate":
                return NotificationType.emailUpdate;
            default:
                return NotificationType.otherUpdate;
        }
    }
    
    public static ApplicationStatus MapCategoryToStatusType(string? category)
    {
        switch (category.Trim().ToLowerInvariant())
        {
            case "interview":
                return ApplicationStatus.interview;
            case "offer":
                return ApplicationStatus.offer;
            case "applied":
                return ApplicationStatus.applied;
            case "rejected":
                return ApplicationStatus.rejected;
            default:
                return ApplicationStatus.offer;
        }
    }

    public static void UpdateApplicationStatusDate(Application application, string? category)
    {
        var cat = string.IsNullOrWhiteSpace(category) ? string.Empty : category.Trim().ToLowerInvariant();

        switch (cat)
        {
            case "interview":
                application.InterviewDate = DateTime.UtcNow;
                break;
            case "offer":
                application.OfferDate = DateTime.UtcNow;
                break;
            case "applied":
                application.AppliedDate = DateTime.UtcNow;
                break;
            case "rejected":
                application.RejectedDate = DateTime.UtcNow;
                break;
        }
    }
}