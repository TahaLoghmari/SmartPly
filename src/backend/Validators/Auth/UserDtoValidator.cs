using backend.DTOs;
using FluentValidation;

namespace backend.Validators;

public sealed class UserDtoValidator : AbstractValidator<UserDto>
{
    public UserDtoValidator()
    {
        RuleFor(u => u.Email).NotEmpty().MinimumLength(3);
        RuleFor(u => u.Name).NotEmpty().MaximumLength(10);
        RuleFor(u => u.Id).NotEmpty();
    }
}