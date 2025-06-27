using backend.Entities;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("gmail")]
[Authorize]
public class GmailController(
    UserManager<User> userManager,
    GmailProvider gmailProvider
) : ControllerBase
{

    [HttpGet("messages")]
    public async Task<IActionResult> GetEmails()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User not authenticated");
        }

        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        var googleAccessToken = await gmailProvider.GetAuthenticationTokenAsync(user);
        if (string.IsNullOrEmpty(googleAccessToken))
        {
            return Unauthorized("No valid Google token found. Please authenticate with Google first.");
        }

        var emails = await gmailProvider.GetGmailMessages(googleAccessToken);
        return Ok(emails);
    }
}
