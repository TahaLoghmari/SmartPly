using backend.Entities;
using Google.Apis.Gmail.v1.Data;
using System.Text.Json;
using backend.Utilities;

namespace backend.Mappings;

internal static class EmailMappings
{
    public static Email MapToEmailEntity(Message message, string userId)
    {
        var headers = message.Payload?.Headers ?? new List<MessagePartHeader>();
    
        return new Email
        {
            Id = message.Id,
            UserId = userId,
            InternalDate = message.InternalDate,
            HeaderDate = EmailUtilities.ParseHeaderDate(EmailUtilities.GetHeaderValue(headers, "Date")),
            Subject = EmailUtilities.GetHeaderValue(headers, "Subject"),
            FromAddress = EmailUtilities.ExtractEmailAddress(EmailUtilities.GetHeaderValue(headers, "From")),
            FromName = EmailUtilities.ExtractDisplayName(EmailUtilities.GetHeaderValue(headers, "From")),
            Labels = JsonSerializer.Serialize(message.LabelIds ?? new List<string>()),
            Snippet = message.Snippet ?? string.Empty,
            IsRead = !(message.LabelIds?.Contains("UNREAD") ?? false),
            IsImportant = message.LabelIds?.Contains("IMPORTANT") ?? false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
    
    public static void UpdateEmail(this Email existingEmail, Email email)
    {
        existingEmail.InternalDate = email.InternalDate;
        existingEmail.HeaderDate = email.HeaderDate;
        existingEmail.Subject = email.Subject;
        existingEmail.FromAddress = email.FromAddress;
        existingEmail.FromName = email.FromName;
        existingEmail.Labels = email.Labels;
        existingEmail.Snippet = email.Snippet;
        existingEmail.IsRead = email.IsRead;
        existingEmail.IsImportant = email.IsImportant;
        existingEmail.UpdatedAt = DateTime.UtcNow;
    }
}