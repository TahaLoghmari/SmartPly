using backend.DTOs;
using backend.Services;
using Google.Apis.Gmail.v1.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;
// add caching and all the APIs best practices
[ApiController]
[Authorize]
[Route("emails")]
[EnableRateLimiting("fixed")]
public class GmailController(
    GmailClientProvider gmailClientProvider) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<Message>> GetEmails(
        CancellationToken cancellationToken,
        [FromQuery] string? pageToken = null)
    {
        await gmailClientProvider.InitializeAsync(User, cancellationToken);
        
        PaginatedMessageResponse subjects = await gmailClientProvider.GetLatestEmailsAsync(cancellationToken, pageToken);

        return Ok(subjects);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Message>> GetEmailById(
        string id,
        CancellationToken cancellationToken)
    {
        await gmailClientProvider.InitializeAsync(User, cancellationToken);
        var message = await gmailClientProvider.GetEmailByIdAsync(id, cancellationToken);
        return Ok(message);
    }
}