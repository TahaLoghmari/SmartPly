using backend.DTOs;
using FluentValidation;

namespace backend.Validators;

public class GoogleCallBackDtoValidator : AbstractValidator<GoogleCallbackDto>
{
    public GoogleCallBackDtoValidator()
    {
        RuleFor(x => x.state)
            .NotEmpty()
            .WithMessage("State parameter is required for security validation.");

        RuleFor(x => x.code)
            .NotEmpty()
            .When(x => string.IsNullOrEmpty(x.error))
            .WithMessage("Authorization code is required when no error is present.");

        RuleFor(x => x.error)
            .Empty()
            .When(x => !string.IsNullOrEmpty(x.code))
            .WithMessage("Error should not be present when authorization code is provided.");

        RuleFor(x => x)
            .Must(x => !string.IsNullOrEmpty(x.code) || !string.IsNullOrEmpty(x.error))
            .WithMessage("Either authorization code or error must be present.");
    }
}