namespace backend.Exceptions;
public class InternalServerErrorException : Exception
{
    public string Title { get; }
    public object? Errors { get; }

    public InternalServerErrorException(string message, string? title = null, object? errors = null)
        : base(message)
    {
        Title = title ?? "Internal Server Error";
        Errors = errors ?? null;
    }
}