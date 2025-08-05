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
[Route("cover-letters")]
[EnableRateLimiting("fixed")]
public class CoverLetterController(
    ILogger<CoverLetterController> logger,
    CoverLetterService coverLetterService) : ControllerBase
{
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<CoverLetterResponseDto>> UploadCoverLetter(
        [FromForm] CoverLetterRequestDto coverLetterRequestDto,
        [FromServices] IValidator<CoverLetterRequestDto> validator,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        logger.LogInformation("Starting cover letter creation for user {UserId}", userId);
        
        await validator.ValidateAndThrowAsync(coverLetterRequestDto,cancellationToken);
        
        var coverLetter = await coverLetterService.CreateCoverLetterAsync(coverLetterRequestDto, userId,cancellationToken);
        
        return CreatedAtAction(nameof(GetUserCoverLetter), new { id = coverLetter.Id }, coverLetter);
    }

    [HttpGet]
    public async Task<ActionResult<ICollection<CoverLetterResponseDto>>> GetUserCoverLetters(
        [FromQuery] CoverLetterQueryParameters query,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        ICollection<CoverLetterResponseDto> result = await coverLetterService.GetUserCoverLetters(query, userId,cancellationToken);
        
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CoverLetterResponseDto>> GetUserCoverLetter(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        var coverLetter = await coverLetterService.GetUserCoverLetter(id, userId,cancellationToken);
        
        return Ok(coverLetter);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditCoverLetter(
        [FromRoute] Guid id,
        [FromBody] CoverLetterRequestDto coverLetterEditRequestDto,
        [FromServices] IValidator<CoverLetterRequestDto> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(coverLetterEditRequestDto,cancellationToken);
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await coverLetterService.EditCoverLetter(id, userId, coverLetterEditRequestDto,cancellationToken);
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCoverLetter(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await coverLetterService.DeleteCoverLetter(id, userId,cancellationToken);
        
        return NoContent();
    }

    [HttpPost("bulk-delete")]
    public async Task<IActionResult> BulkDeleteCoverLetters(
        [FromBody] BulkDeleteRequestDto request,
        [FromServices] IValidator<BulkDeleteRequestDto> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(request,cancellationToken);
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await coverLetterService.BulkDeleteCoverLetters(request.Ids, userId,cancellationToken);
        
        return NoContent();
    }

    [HttpGet("{id}/download")]
    public async Task<IActionResult> DownloadCoverLetter(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        DownloadResultDto result = await coverLetterService.DownloadCoverLetter(id, userId,cancellationToken);
        
        return File(result.Bytes, "application/pdf", $"{result.Name}.pdf"); 
    }
}

