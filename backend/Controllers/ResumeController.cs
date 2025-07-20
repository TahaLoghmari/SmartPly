using System.Security.Claims;
using backend.DTOs.Resume;
using backend.Services;
using backend.Services.Shared;
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
    ResumeService resumeService,
    SupabaseService supabaseService) : ControllerBase
{
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ResumeResponseDto>> UploadResume(
        [FromForm] ResumeRequestDto resumeRequestDto,
        [FromServices] IValidator<ResumeRequestDto> validator)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        logger.LogInformation("Starting resume creation for user {UserId}", userId);

        await validator.ValidateAndThrowAsync(resumeRequestDto);

        var resume = await resumeService.CreateResumeAsync(resumeRequestDto, userId);

        return CreatedAtAction(nameof(GetUserResume), new { id = resume.Id }, resume);
    }

    [HttpGet]
    public async Task<ActionResult<ICollection<ResumeResponseDto>>> GetUserResumes(
        [FromQuery] ResumeQueryParameters query)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        ICollection<ResumeResponseDto> result = await resumeService.GetUserResumes(query, userId);

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ResumeResponseDto>> GetUserResume(
        [FromRoute] Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var resume = await resumeService.GetUserResume(id, userId);

        return Ok(resume);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditResume(
        [FromRoute] Guid id,
        [FromBody] ResumeRequestDto resumeEditRequestDto,
        [FromServices] IValidator<ResumeRequestDto> validator)
    {
        await validator.ValidateAndThrowAsync(resumeEditRequestDto);

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        await resumeService.EditResume(id, userId, resumeEditRequestDto);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteResume(
        [FromRoute] Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        await resumeService.DeleteResume(id, userId);

        return NoContent();
    }
    
    [HttpPost("bulk-delete")]
    public async Task<IActionResult> BulkDeleteResumes(
        [FromBody] BulkDeleteRequestDto request,
        [FromServices] IValidator<BulkDeleteRequestDto> validator)
    {
        await validator.ValidateAndThrowAsync(request);
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await resumeService.BulkDeleteResumes(request.ResumeIds, userId);
        
        return NoContent();
    }
    
    [HttpGet("{id}/download")]
    public async Task<IActionResult> DownloadResume(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var resume = await resumeService.GetUserResume(id, userId);

        var bytes = await supabaseService.DownloadFileAsync(resume.ResumeUrl);
        
        return File(bytes, "application/pdf", $"{resume.Name}.pdf"); 
    }
}