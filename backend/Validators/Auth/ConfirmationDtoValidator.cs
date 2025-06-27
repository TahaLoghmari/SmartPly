using FluentValidation;
using backend.DTOs;
using backend.DTOs.Email;

public class ConfirmationDtoValidator : AbstractValidator<ConfirmationDto>
{
    public ConfirmationDtoValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId is required.");

        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Token is required.");
    }
}