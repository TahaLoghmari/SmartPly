using FluentValidation;
using backend.DTOs.Application;
namespace backend.Validators.Application;

public class ApplicationRequestDtoValidator : AbstractValidator<ApplicationRequestDto>
{
    public ApplicationRequestDtoValidator()
    {
        RuleFor(x => x.ResumeId)
            .NotEmpty().WithMessage("ResumeId is required.");

        RuleFor(x => x.CompanyName)
            .NotEmpty().WithMessage("CompanyName is required.")
            .MaximumLength(100).WithMessage("CompanyName must be at most 100 characters.");

        RuleFor(x => x.CompanyEmail)
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CompanyEmail))
            .WithMessage("CompanyEmail must be a valid email address.");

        RuleFor(x => x.Position)
            .NotEmpty().WithMessage("Position is required.")
            .MaximumLength(100).WithMessage("Position must be at most 100 characters.");

        RuleFor(x => x.Link)
            .NotEmpty().WithMessage("Link is required.")
            .MaximumLength(200).WithMessage("Link must be at most 200 characters.");

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Location is required.")
            .MaximumLength(100).WithMessage("Location must be at most 100 characters.");

        RuleFor(x => x.StartSalary)
            .GreaterThanOrEqualTo(0).WithMessage("StartSalary must be non-negative.");

        RuleFor(x => x.EndSalary)
            .GreaterThanOrEqualTo(x => x.StartSalary)
            .WithMessage("EndSalary must be greater than or equal to StartSalary.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Status is invalid.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Type is invalid.");

        RuleFor(x => x.JobType)
            .IsInEnum().WithMessage("JobType is invalid.");

        RuleFor(x => x.Level)
            .IsInEnum().WithMessage("Level is invalid.");

        RuleFor(x => x.TechnologiesUsed)
            .Must(list => list == null || list.All(t => !string.IsNullOrWhiteSpace(t)))
            .WithMessage("TechnologiesUsed cannot contain empty values.");

        RuleFor(x => x.Deadline)
            .GreaterThanOrEqualTo(DateTime.UtcNow).When(x => x.Deadline.HasValue)
            .WithMessage("Deadline must be in the future.");
        
        RuleFor(a => a)
            .Must(a => !a.WishListDate.HasValue || !a.AppliedDate.HasValue || a.WishListDate.Value.ToUniversalTime() <= a.AppliedDate.Value.ToUniversalTime())
            .WithMessage("WishListDate must be less than AppliedDate.");

        RuleFor(a => a)
            .Must(a => !a.AppliedDate.HasValue || !a.InterviewDate.HasValue || a.AppliedDate.Value.ToUniversalTime() <= a.InterviewDate.Value.ToUniversalTime())
            .WithMessage("AppliedDate must be less than InterviewDate.");

        RuleFor(a => a)
            .Must(a => !a.InterviewDate.HasValue || !a.OfferDate.HasValue || a.InterviewDate.Value.ToUniversalTime() <= a.OfferDate.Value.ToUniversalTime())
            .WithMessage("InterviewDate must be less than OfferDate.");

        RuleFor(a => a)
            .Must(a => !a.OfferDate.HasValue || !a.RejectedDate.HasValue || a.OfferDate.Value.ToUniversalTime() <= a.RejectedDate.Value.ToUniversalTime())
            .WithMessage("OfferDate must be less than or equal to RejectedDate.");
        
        RuleFor(a => a)
            .Must(a => !a.OfferDate.HasValue || !a.GhostedDate.HasValue || a.OfferDate.Value.ToUniversalTime() <= a.GhostedDate.Value.ToUniversalTime())
            .WithMessage("OfferDate must be less than or equal to RejectedDate.");
    }
}