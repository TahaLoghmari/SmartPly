namespace backend.Exceptions;

public class NotFoundException : Exception
{
    public string Title { get; }
    public object? Errors { get; }
    public NotFoundException(string message, string? title = null, object? errors = null)
        : base(message)
    {
        Title = title ?? "Not Found";
        Errors = errors ?? null;
    }
}