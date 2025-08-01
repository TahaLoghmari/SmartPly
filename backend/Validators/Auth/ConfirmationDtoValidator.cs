using FluentValidation;
using backend.DTOs;

namespace backend.Validators;

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