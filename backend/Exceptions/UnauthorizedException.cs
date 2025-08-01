namespace backend.Exceptions;

public class UnauthorizedException : Exception
{
    public string Title { get; }
    public object? Errors { get; }
    public UnauthorizedException(string message, string? title = null, object? errors = null)
        : base(message)
    {
        Title = title ?? "Unauthorized";
        Errors = errors ?? null;
    }
}