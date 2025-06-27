namespace backend.DTOs
{
    public sealed record EmailResetPasswordDto
    {
        public string Token { get; init; } 
        public string Email { get; init; }
    }
}
