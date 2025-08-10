using System.Security.Claims;
using backend.DTOs;
using backend.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("applications")]
[EnableRateLimiting("fixed")]
public class ApplicationController(
    ILogger<ApplicationController> logger,
    ApplicationService applicationService): ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ApplicationResponseDto>> CreateApplication(
        [FromBody] ApplicationRequestDto applicationRequestDto,
        [FromServices] IValidator<ApplicationRequestDto> validator,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        logger.LogInformation("Starting application creation for user {UserId}", userId);
        
        await validator.ValidateAndThrowAsync(applicationRequestDto,cancellationToken);

        ApplicationResponseDto application = await applicationService.CreateApplicationAsync(applicationRequestDto,userId,cancellationToken);
        
        return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
    }

    [HttpGet]
    public async Task<ActionResult<PaginationResultDto<ApplicationResponseDto>>> GetApplications( 
        [FromQuery] ApplicationQueryParameters query,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        PaginationResultDto<ApplicationResponseDto> paginationResultDto = await applicationService.GetApplicationsAsync(query, userId,cancellationToken);
        
        return Ok(paginationResultDto);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationResponseDto>> GetApplication(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        ApplicationResponseDto application = await applicationService.GetApplicationAsync(id, userId,cancellationToken);
        
        return Ok(application);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> EditApplication(
        [FromRoute] Guid id,
        [FromBody] ApplicationRequestDto applicationEditRequestDto,
        [FromServices] IValidator<ApplicationRequestDto> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(applicationEditRequestDto,cancellationToken);
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await applicationService.EditApplicationAsync(id,userId, applicationEditRequestDto,cancellationToken);

        return NoContent();
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchApplication(
        [FromRoute] Guid id,
        [FromBody] JsonPatchDocument<ApplicationRequestDto> patchDoc,
        [FromServices] IValidator<ApplicationRequestDto> validator,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await applicationService.PatchApplicationAsync(id, userId, patchDoc,validator,ModelState,cancellationToken);

        return NoContent();
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteApplication(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await applicationService.DeleteApplicationAsync(id, userId,cancellationToken);

        return NoContent();
    }
    
    [HttpPost("bulk-delete")]
    public async Task<IActionResult> BulkDeleteApplications(
        [FromBody] BulkDeleteRequestDto request,
        [FromServices] IValidator<BulkDeleteRequestDto> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(request,cancellationToken);
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await applicationService.BulkDeleteApplicationsAsync(request.Ids, userId,cancellationToken);

        return NoContent();
    }
}