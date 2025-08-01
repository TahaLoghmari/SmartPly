public class BadRequestException : Exception
{
    public string Title { get; }
    public object? Errors { get; }

    public BadRequestException(string message, string? title = null, object? errors = null)
        : base(message)
    {
        Title = title ?? "Bad Request";
        Errors = errors ?? null;
    }
}