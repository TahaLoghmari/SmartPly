using backend.DTOs.Resume;
using FluentValidation;

namespace backend.Validators.Resume;

public class BulkDeleteRequestDtoValidator : AbstractValidator<BulkDeleteRequestDto>
{
    public BulkDeleteRequestDtoValidator()
    {
        RuleFor(x => x.ResumeIds)
            .NotNull().WithMessage("ResumeIds is required.")
            .NotEmpty().WithMessage("At least one resume ID must be provided.");

        RuleForEach(x => x.ResumeIds)
            .NotEqual(Guid.Empty).WithMessage("Resume ID cannot be empty.");
    }
}