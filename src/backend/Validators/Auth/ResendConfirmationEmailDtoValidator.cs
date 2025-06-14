using FluentValidation;
using backend.DTOs.Email;

public class ResendConfirmationEmailDtoValidator : AbstractValidator<ResendConfirmationEmailDto>
{
    public ResendConfirmationEmailDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.");
    }
}