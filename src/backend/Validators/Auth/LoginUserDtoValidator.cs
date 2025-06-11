using System.Text.RegularExpressions;
using backend.DTOs;
using FluentValidation;

namespace backend.Validators;

public sealed class LoginUserDtoValidator : AbstractValidator<LoginUserDto>
{
    public LoginUserDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required.")
            .Must(BeValidEmailOrUsername)
            .WithMessage("Please enter a valid email address or username.")
            .MaximumLength(256)
            .WithMessage("Email/Username must be at most 256 characters.");
        
        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required.")
            .MinimumLength(1)
            .WithMessage("Password cannot be empty.")
            .MaximumLength(100)
            .WithMessage("Password must be at most 100 characters.");
    }

    private static bool BeValidEmailOrUsername(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return false;
        
        if (input.Contains('@'))
        {
            return IsValidEmail(input);
        }
        
        return IsValidUsername(input);
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
    private static bool IsValidUsername(string username)
    {
        return Regex.IsMatch(username, @"^[a-zA-Z0-9@\-\._]+$");
    }
}