using backend.DTOs;
using FluentValidation;

namespace backend.Validators.Ai;

public class JobDetectionPromptResultValidator : AbstractValidator<JobDetectionPromptResult>
{
    public JobDetectionPromptResultValidator()
    {
        var validCategories = new[] { "interview", "offer", "applied", "rejected", "emailUpdate" };

        RuleFor(x => x.IsJobRelated).NotNull();

        When(x => x.IsJobRelated, () =>
        {
            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category is required when the email is job-related.")
                .Must(c => validCategories.Contains(c, StringComparer.OrdinalIgnoreCase))
                .WithMessage($"Category must be one of the following: {string.Join(", ", validCategories)}.");

            RuleFor(x => x.Summary)
                .NotEmpty().WithMessage("Summary is required when the email is job-related.");
        });

        When(x => !x.IsJobRelated, () =>
        {
            RuleFor(x => x.Category)
                .Empty().WithMessage("Category must be empty when the email is not job-related.");

            RuleFor(x => x.Summary)
                .Empty().WithMessage("Summary must be empty when the email is not job-related.");
        });
    }
}