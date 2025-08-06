using backend.Services;
using Google.Apis.Gmail.v1.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("gmail")]
[EnableRateLimiting("fixed")]
public class GmailController(
    GmailClientProvider gmailClientProvider) : ControllerBase
{
    public async Task<ActionResult<Message>> GetInbox(
        CancellationToken cancellationToken)
    {
        var gmailService = await gmailClientProvider.GetGmailServiceAsync(User,cancellationToken);
        
        List<Message> subjects = await gmailClientProvider.GetLatestEmailsAsync(gmailService,cancellationToken);

        return Ok(subjects);
    }
}