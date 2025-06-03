using backend.DTOs;
using FluentValidation;

namespace backend.Validators;

public sealed class RegisterUserDtoValidator : AbstractValidator<RegisterUserDto>
{
    public RegisterUserDtoValidator()
    {
        RuleFor(r => r.Email)
            .NotEmpty().WithMessage("Email is required.")
            .MinimumLength(3).WithMessage("Email must be at least 3 characters.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(r => r.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters.")
            .MaximumLength(32).WithMessage("Password must be at most 32 characters.");

        RuleFor(r => r.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MinimumLength(3).WithMessage("Name must be at least 3 characters.")
            .MaximumLength(50).WithMessage("Name must be at most 50 characters.");

        RuleFor(r => r.ConfirmPassword)
            .Equal(r => r.Password).WithMessage("Passwords do not match.");
    }
}