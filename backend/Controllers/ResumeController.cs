using System.Security.Claims;
using backend.DTOs;
using backend.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("resumes")]
[EnableRateLimiting("fixed")]
public class ResumeController(
    ILogger<ResumeController> logger,
    ResumeService resumeService) : ControllerBase
{
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ResumeResponseDto>> UploadResume(
        [FromForm] ResumeRequestDto resumeRequestDto,
        [FromServices] IValidator<ResumeRequestDto> validator,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        logger.LogInformation("Starting resume creation for user {UserId}", userId);

        await validator.ValidateAndThrowAsync(resumeRequestDto,cancellationToken);

        var resume = await resumeService.CreateResumeAsync(resumeRequestDto, userId,cancellationToken);

        return CreatedAtAction(nameof(GetUserResume), new { id = resume.Id }, resume);
    }

    [HttpGet]
    public async Task<ActionResult<ICollection<ResumeResponseDto>>> GetUserResumes(
        [FromQuery] ResumeQueryParameters query,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        ICollection<ResumeResponseDto> result = await resumeService.GetUserResumes(query, userId,cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ResumeResponseDto>> GetUserResume(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var resume = await resumeService.GetUserResume(id, userId,cancellationToken);

        return Ok(resume);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditResume(
        [FromRoute] Guid id,
        [FromBody] ResumeRequestDto resumeEditRequestDto,
        [FromServices] IValidator<ResumeRequestDto> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(resumeEditRequestDto,cancellationToken);

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        await resumeService.EditResume(id, userId, resumeEditRequestDto,cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteResume(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        await resumeService.DeleteResume(id, userId,cancellationToken);

        return NoContent();
    }
    
    [HttpPost("bulk-delete")]
    public async Task<IActionResult> BulkDeleteResumes(
        [FromBody] BulkDeleteRequestDto request,
        [FromServices] IValidator<BulkDeleteRequestDto> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(request,cancellationToken);
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await resumeService.BulkDeleteResumes(request.Ids, userId,cancellationToken);
        
        return NoContent();
    }
    
    [HttpGet("{id}/download")]
    public async Task<IActionResult> DownloadResume(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        DownloadResultDto result = await resumeService.DownloadResume(id, userId,cancellationToken);
        
        return File(result.Bytes, "application/pdf", $"{result.Name}.pdf"); 
    }
}