using backend.DTOs;
using FluentValidation;

namespace backend.Validators;

public sealed class LoginUserDtoValidator : AbstractValidator<LoginUserDto>
{
    public LoginUserDtoValidator()
    {
        RuleFor(l => l.Email).NotEmpty().MinimumLength(3);
        RuleFor(l => l.Password).NotEmpty().MaximumLength(8);
    }
}