using backend.DTOs;
using FluentValidation;

namespace backend.Validators;
public sealed class EmailResetPasswordDtoValidator : AbstractValidator<EmailResetPasswordDto>
{
    public EmailResetPasswordDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required.")
            .EmailAddress()
            .WithMessage("Invalid email format.")
            .MaximumLength(256)
            .WithMessage("Email must be at most 256 characters.");

        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Token is required.");
    }
}