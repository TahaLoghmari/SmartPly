using FluentValidation;
using backend.DTOs;

public class UserRequestDtoValidator : AbstractValidator<UserRequestDto>
{
    public UserRequestDtoValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(50)
            .WithMessage("Name must be at most 50 characters.");


        RuleFor(x => x.Password)
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
            .WithMessage("Password must contain at least one non-alphanumeric character (!@#$%^&*()_+-=[]{}|;:,.<>?).")
            .When(x => !string.IsNullOrEmpty(x.Password));
        
        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password)
            .WithMessage("Current password and confirmation do not match.")
            .When(x => !string.IsNullOrEmpty(x.Password));
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

