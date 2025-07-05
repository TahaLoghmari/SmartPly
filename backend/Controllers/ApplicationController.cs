using System.Net.Mime;
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
    public async Task<ActionResult<ApplicationResponseDto>> CreateApplication(
        [FromBody] ApplicationCreateRequestDto applicationCreateRequestDto,
        [FromServices] IValidator<ApplicationCreateRequestDto> validator)
    {
        // Update applications Count for the ResumeId
        // if this gets messy add Service Layer for Application
        logger.LogInformation("Starting application creation for user {UserId}", applicationCreateRequestDto.UserId);
        
        await validator.ValidateAndThrowAsync(applicationCreateRequestDto);

        Application application = applicationCreateRequestDto.ToApplication();
        
        dbContext.Applications.Add(application);
        
        Resume? resume = await dbContext.Resumes
            .FirstOrDefaultAsync(r => r.Id == applicationCreateRequestDto.ResumeId && r.UserId == applicationCreateRequestDto.UserId);
        
        if (resume is null)
        {
            logger.LogWarning("Create application failed - resume not found for Id: {ResumeId}", applicationCreateRequestDto.ResumeId);
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Resume not found",
                Detail = $"No Resume found with ID '{applicationCreateRequestDto.ResumeId}'."
            });
        }

        resume.ApplicationsCount++;
        
        await dbContext.SaveChangesAsync();
        
        logger.LogInformation("Application created with ID {ApplicationId}", application.Id);
        
        return CreatedAtAction(nameof(CreateApplication), application.ToApplicationResponseDto());
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationResponseDto>> GetApplication(
        [FromRoute] ApplicationGetRequestDto applicationGetRequestDto,
        ProblemDetailsFactory problemDetailsFactory)
    {
        // In case of adding more fields , add validation
        logger.LogInformation("Retrieving application with ID {ApplicationId}", applicationGetRequestDto.id);
        
        Application? application = await dbContext.Applications
            .FirstOrDefaultAsync(a => a.Id == applicationGetRequestDto.id );

        if (application is null)
        {
            logger.LogWarning("Get current application failed - application not found for Id: {applicationId}", applicationGetRequestDto.id);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status404NotFound,
                title: "Application not found",
                detail: $"No Application found with ID '{applicationGetRequestDto.id}'."
            );
            return NotFound(problem);
        }
        
        logger.LogInformation("Application Retrieved with ID {ApplicationId}", application.Id);
        
        return Ok(application.ToApplicationResponseDto());
    }
}