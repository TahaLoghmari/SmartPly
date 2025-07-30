using System.Collections.Concurrent;
using System.Security.Claims;
using backend.DTOs.Application;
using backend.DTOs.Shared;
using backend.Entities;
using backend.Enums;
using backend.Mappings;
using backend.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

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
        [FromServices] IValidator<ApplicationRequestDto> validator)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        logger.LogInformation("Starting application creation for user {UserId}", userId);
        
        await validator.ValidateAndThrowAsync(applicationRequestDto);

        ApplicationResponseDto application = await applicationService.CreateApplicationAsync(applicationRequestDto,userId);
        
        return CreatedAtAction(nameof(GetUserApplication), new { id = application.Id }, application);
    }

    [HttpGet]
    public async Task<ActionResult<PaginationResultDto<ApplicationResponseDto>>> GetUserApplications( 
        [FromQuery] ApplicationQueryParameters query)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        PaginationResultDto<ApplicationResponseDto> paginationResultDto = await applicationService.GetUserApplications(query, userId);
        
        return Ok(paginationResultDto);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationResponseDto>> GetUserApplication(
        [FromRoute] Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        ApplicationResponseDto application = await applicationService.GetUserApplication(id, userId);
        
        return Ok(application);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> EditApplication(
        [FromRoute] Guid id,
        [FromBody] ApplicationRequestDto applicationEditRequestDto,
        [FromServices] IValidator<ApplicationRequestDto> validator)
    {
        await validator.ValidateAndThrowAsync(applicationEditRequestDto);
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await applicationService.EditApplication(id,userId, applicationEditRequestDto);

        return NoContent();
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchApplication(
        [FromRoute] Guid id,
        [FromBody] JsonPatchDocument<ApplicationRequestDto> patchDoc,
        [FromServices] IValidator<ApplicationRequestDto> validator)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await applicationService.PatchApplication(id, userId, patchDoc,validator,ModelState);

        return NoContent();
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteApplication(
        [FromRoute] Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await applicationService.DeleteApplication(id, userId);

        return NoContent();
    }
    
    [HttpPost("bulk-delete")]
    public async Task<IActionResult> BulkDeleteApplications(
        [FromBody] BulkDeleteRequestDto request,
        [FromServices] IValidator<BulkDeleteRequestDto> validator)
    {
        await validator.ValidateAndThrowAsync(request);
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await applicationService.BulkDeleteApplications(request.Ids, userId);

        return NoContent();
    }
}