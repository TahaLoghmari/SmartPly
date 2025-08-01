using backend.DTOs;
using FluentValidation;

namespace backend.Validators;

public class ResumeRequestDtoValidator : AbstractValidator<ResumeRequestDto>
{
    public ResumeRequestDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(100);

        RuleFor(x => x.File)
            .NotNull().WithMessage("File is required.")
            .Must(file => file != null && file.Length > 0).WithMessage("File cannot be empty.")
            .Must(file => file != null && file.ContentType == "application/pdf")
            .WithMessage("Only PDF files are allowed.")
            .Must(file => file != null && file.Length <= 5 * 1024 * 1024)
            .WithMessage("File size must not exceed 5MB.");
    }
}