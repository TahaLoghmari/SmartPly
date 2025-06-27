using FluentValidation;
using backend.DTOs.Email;

public class ResendConfirmationEmailDtoValidator : AbstractValidator<ResendConfirmationEmailDto>
{
    public ResendConfirmationEmailDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required.")
            .EmailAddress()
            .WithMessage("Invalid email format.")
            .MaximumLength(256)
            .WithMessage("Email must be at most 256 characters.");
    }
}