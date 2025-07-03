using backend.DTOs;
using FluentValidation;

namespace backend.Validators;

public sealed class UserDtoValidator : AbstractValidator<UserDto>
{
    public UserDtoValidator()
    {
        RuleFor(u => u.Email).NotEmpty().MinimumLength(3);
        RuleFor(u => u.GoogleEmail)
            .EmailAddress()
            .WithMessage("'{PropertyName}' must be a valid email address.")
            .When(u => !string.IsNullOrEmpty(u.GoogleEmail));
        RuleFor(u => u.Name).NotEmpty().MaximumLength(10);
        RuleFor(u => u.Id).NotEmpty();
        RuleFor(u => u.ImageUrl)
            .MaximumLength(500)
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("'{PropertyName}' must be a valid URL.")
            .When(u => !string.IsNullOrEmpty(u.ImageUrl));
        RuleFor(u => u.GmailConnected).NotNull();
    }
}