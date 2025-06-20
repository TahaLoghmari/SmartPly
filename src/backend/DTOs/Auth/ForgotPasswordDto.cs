namespace backend.DTOs
{
    public sealed record ForgotPasswordDto
    {
        public string Email { get; init; }
    }
}
