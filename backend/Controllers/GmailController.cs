using backend.DTOs;
using backend.Services;
using Google.Apis.Gmail.v1.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("emails")]
[EnableRateLimiting("fixed")]
public class GmailController(
    GmailClientProvider gmailClientProvider) : ControllerBase
{
    public async Task<ActionResult<Message>> GetEmails(
        CancellationToken cancellationToken,
        [FromQuery] string? pageToken = null)
    {
        var gmailService = await gmailClientProvider.GetGmailServiceAsync(User,cancellationToken);
        
        PaginatedMessageResponse subjects = await gmailClientProvider.GetLatestEmailsAsync(gmailService,cancellationToken,pageToken);

        return Ok(subjects);
    }
}