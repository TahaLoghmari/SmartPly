using System.Security.Claims;
using backend.DTOs;
using backend.Entities;
using backend.Services;
using Google.Apis.Gmail.v1.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Mscc.GenerativeAI.Web;

namespace backend.Controllers;
[ApiController]
[Authorize]
[Route("emails")]
[EnableRateLimiting("fixed")]
public class EmailController(
    EmailService emailService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<Message>> GetEmails(
        CancellationToken cancellationToken,
        [FromQuery] EmailQueryParameters query)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        PaginationResultDto<Email> paginationResultDto = await emailService.GetEmailsAsync(query, userId,cancellationToken);
        
        return Ok(paginationResultDto);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Message>> GetEmailById(
        [FromRoute] string id,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        Message application = await emailService.GetEmailByIdAsync(id, userId,cancellationToken);
        
        return Ok(application);
    }
}