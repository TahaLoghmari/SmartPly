namespace backend.DTOs;

public sealed record GoogleCallbackDto(string? code, string? error = null , string? state = null ); 