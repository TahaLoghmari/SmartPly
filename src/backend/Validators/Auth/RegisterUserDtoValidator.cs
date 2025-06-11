using backend.DTOs;
using FluentValidation;

namespace backend.Validators;

public sealed class RegisterUserDtoValidator : AbstractValidator<RegisterUserDto>
{
    public RegisterUserDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required.")
            .EmailAddress()
            .WithMessage("Invalid email format.")
            .MaximumLength(256)
            .WithMessage("Email must be at most 256 characters.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required.")
            .MinimumLength(6)
            .WithMessage("Password must be at least 6 characters long.")
            .MaximumLength(100)
            .WithMessage("Password must be at most 100 characters long.")
            .Must(ContainUppercase)
            .WithMessage("Password must contain at least one uppercase letter (A-Z).")
            .Must(ContainLowercase)
            .WithMessage("Password must contain at least one lowercase letter (a-z).")
            .Must(ContainDigit)
            .WithMessage("Password must contain at least one digit (0-9).")
            .Must(ContainNonAlphanumeric)
            .WithMessage("Password must contain at least one non-alphanumeric character (!@#$%^&*()_+-=[]{}|;:,.<>?).");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required.")
            .MaximumLength(50)
            .WithMessage("Name must be at most 50 characters.");
        
        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password)
            .WithMessage("Password and confirmation password do not match.");
    }

    private static bool ContainUppercase(string password)
    {
        return !string.IsNullOrEmpty(password) && password.Any(char.IsUpper);
    }

    private static bool ContainLowercase(string password)
    {
        return !string.IsNullOrEmpty(password) && password.Any(char.IsLower);
    }

    private static bool ContainDigit(string password)
    {
        return !string.IsNullOrEmpty(password) && password.Any(char.IsDigit);
    }

    private static bool ContainNonAlphanumeric(string password)
    {
        return !string.IsNullOrEmpty(password) && password.Any(ch => !char.IsLetterOrDigit(ch));
    }
}