﻿using backend.DTOs;
using FluentValidation;

namespace backend.Validators;

public class BulkDeleteRequestDtoValidator : AbstractValidator<BulkDeleteRequestDto>
{
    public BulkDeleteRequestDtoValidator()
    {
        RuleFor(x => x.Ids)
            .NotNull().WithMessage("Ids is required.")
            .NotEmpty().WithMessage("At least one ID must be provided.");

        RuleForEach(x => x.Ids)
            .NotEqual(Guid.Empty).WithMessage("ID cannot be empty.");
    }
}