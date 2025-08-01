namespace backend.DTOs;

public record SendEmailDto(string ToEmail, string Subject, string Body, bool IsBodyHtml = false);