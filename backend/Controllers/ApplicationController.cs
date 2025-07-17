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
        logger.LogInformation("Starting application creation for user {UserId}", applicationRequestDto.UserId);
        
        await validator.ValidateAndThrowAsync(applicationRequestDto);

        ApplicationResponseDto application = await applicationService.CreateApplicationAsync(applicationRequestDto);
        
        return CreatedAtAction(nameof(GetUserApplication), new { id = application.Id }, application);
    }

    [HttpGet]
    public async Task<ActionResult<PaginationResult<ApplicationResponseDto>>> GetUserApplications( 
        [FromQuery] ApplicationQueryParameters query)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        PaginationResult<ApplicationResponseDto> paginationResult = await applicationService.GetUserApplications(query, userId);
        
        return Ok(paginationResult);
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteApplication(
        [FromRoute] Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await applicationService.DeleteApplication(id, userId);

        return NoContent();
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetApplicationStats()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var result = await applicationService.GetApplicationStats(userId);

        return Ok(result);
    }
}