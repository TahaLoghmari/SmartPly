﻿using System.Net.Mime;
using System.Security.Claims;
using backend.DTOs.Application;
using backend.Entities;
using backend.Mappings;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("applications")]
public class ApplicationController(
    ILogger<ApplicationController> logger,
    ApplicationDbContext dbContext ): ControllerBase
{
    [HttpPost]
    [ProducesResponseType<ApplicationResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApplicationResponseDto>> CreateApplication(
        [FromBody] ApplicationRequestDto applicationRequestDto,
        [FromServices] IValidator<ApplicationRequestDto> validator)
    {
        logger.LogInformation("Starting application creation for user {UserId}", applicationRequestDto.UserId);
        
        await validator.ValidateAndThrowAsync(applicationRequestDto);

        Application application = applicationRequestDto.ToApplication();
        
        dbContext.Applications.Add(application);
        
        Resume? resume = await dbContext.Resumes
            .FirstOrDefaultAsync(r => r.Id == applicationRequestDto.ResumeId && r.UserId == applicationRequestDto.UserId);
        
        if (resume is null)
        {
            logger.LogWarning("Create application failed - resume not found for Id: {ResumeId}", applicationRequestDto.ResumeId);
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Resume not found",
                Detail = $"No Resume found with ID '{applicationRequestDto.ResumeId}'."
            });
        }

        resume.ApplicationsCount++;
        
        await dbContext.SaveChangesAsync();
        
        logger.LogInformation("Application created with ID {ApplicationId}", application.Id);
        
        return CreatedAtAction(nameof(GetUserApplication), new { id = application.Id }, application.ToApplicationResponseDto());
    }

    [HttpGet]
    [ProducesResponseType<ICollection<ApplicationResponseDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ICollection<ApplicationResponseDto>>> GetUserApplications(
        ProblemDetailsFactory problemDetailsFactory)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "User ID claim is missing."
            );
            return Unauthorized(problem);
        }

        return Ok(await dbContext.Applications
            .Where(a => a.UserId == userId)
            .Select(a => a.ToApplicationResponseDto())
            .ToListAsync());
    }
    
    [HttpGet("{id}")]
    [ProducesResponseType<ApplicationResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApplicationResponseDto>> GetUserApplication(
        [FromRoute] Guid id ,
        ProblemDetailsFactory problemDetailsFactory)
    {
        if (id == Guid.Empty)
        {
            logger.LogWarning("Invalid application id provided.");
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Invalid ID",
                Detail = "The provided application ID is invalid."
            });
        }
        
        logger.LogInformation("Retrieving application with ID {ApplicationId}", id);
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "User ID claim is missing."
            );
            return Unauthorized(problem);
        }
        
        Application? application = await dbContext.Applications
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (application is null)
        {
            logger.LogWarning("Get current application failed - application not found for Id: {applicationId}", id);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status404NotFound,
                title: "Application not found",
                detail: $"No Application found with ID '{id}'."
            );
            return NotFound(problem);
        }
        
        logger.LogInformation("Application Retrieved with ID {ApplicationId}", application.Id);
        
        return Ok(application.ToApplicationResponseDto());
    }
    
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)] 
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> EditApplication(
        [FromRoute] Guid id,
        [FromBody] ApplicationRequestDto applicationEditRequestDto,
        [FromServices] IValidator<ApplicationRequestDto> validator,
        ProblemDetailsFactory problemDetailsFactory)
    {
        if (id == Guid.Empty)
        {
            logger.LogWarning("Invalid application id provided.");
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Invalid ID",
                Detail = "The provided application ID is invalid."
            });
        }
        
        logger.LogInformation("Starting application editing for user {UserId}", applicationEditRequestDto.UserId);
        
        await validator.ValidateAndThrowAsync(applicationEditRequestDto);
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "User ID claim is missing."
            );
            return Unauthorized(problem);
        }
        
        Application? application = await dbContext.Applications.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (application is null)
        {
            logger.LogWarning("Get current application failed - application not found for Id: {applicationId}", id);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status404NotFound,
                title: "Application not found",
                detail: $"No Application found with ID '{id}'."
            );
            return NotFound(problem);
        }
        
        Resume? oldResume = await dbContext.Resumes
            .FirstOrDefaultAsync(r => r.Id == application.ResumeId && r.UserId == application.UserId);
        
        
        if (oldResume is null)
        {
            logger.LogWarning("Editing application failed - resume not found for Id: {ResumeId}", application.ResumeId);
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Resume not found",
                Detail = $"No Resume found with ID '{applicationEditRequestDto.ResumeId}'."
            });
        }

        oldResume.ApplicationsCount--;
        logger.LogInformation("Decremented ApplicationsCount for old ResumeId: {OldResumeId}, NewCount: {ApplicationsCount}", oldResume.Id, oldResume.ApplicationsCount);
        
        Resume? newResume = await dbContext.Resumes
            .FirstOrDefaultAsync(r => r.Id == applicationEditRequestDto.ResumeId && r.UserId == applicationEditRequestDto.UserId);
        
        if (newResume is null)
        {
            logger.LogWarning("Editing application failed - resume not found for Id: {ResumeId}", applicationEditRequestDto.ResumeId);
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Resume not found",
                Detail = $"No Resume found with ID '{applicationEditRequestDto.ResumeId}'."
            });
        }
        
        newResume.ApplicationsCount++;
        logger.LogInformation("Incremented ApplicationsCount for new ResumeId: {NewResumeId}, NewCount: {ApplicationsCount}", newResume.Id, newResume.ApplicationsCount);
        
        application.UpdateFromDto(applicationEditRequestDto);
        logger.LogInformation("Updated application entity from DTO. ApplicationId: {ApplicationId}", application.Id);
        
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Application edited with ID {ApplicationId}", application.Id);

        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)] 
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteApplication(
        [FromRoute] Guid id,
        ProblemDetailsFactory problemDetailsFactory)
    {
        if (id == Guid.Empty)
        {
            logger.LogWarning("Invalid application id provided.");
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Invalid ID",
                Detail = "The provided application ID is invalid."
            });
        }
        
        logger.LogInformation("Deleting application with ID {ApplicationId}", id);
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "User ID claim is missing."
            );
            return Unauthorized(problem);
        }
        
        Application? application = await dbContext.Applications
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (application is null)
        {
            logger.LogWarning("Get current application failed - application not found for Id: {applicationId}", id);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status404NotFound,
                title: "Application not found",
                detail: $"No Application found with ID '{id}'."
            );
            return NotFound(problem);
        }
        
        Resume? resume = await dbContext.Resumes
            .FirstOrDefaultAsync(r => r.Id == application.ResumeId && r.UserId == application.UserId);
        
        if (resume is null)
        {
            logger.LogWarning("Create application failed - resume not found for Id: {ResumeId}", application.ResumeId);
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Resume not found",
                Detail = $"No Resume found with ID '{application.ResumeId}'."
            });
        }

        resume.ApplicationsCount--;
        logger.LogInformation("Decremented ApplicationsCount for ResumeId: {ResumeId}, NewCount: {ApplicationsCount}", resume.Id, resume.ApplicationsCount);
        
        dbContext.Applications.Remove(application);
        await dbContext.SaveChangesAsync();
        
        logger.LogInformation("Application deleted with ID {ApplicationId}", application.Id);
        
        return NoContent();
    }
}