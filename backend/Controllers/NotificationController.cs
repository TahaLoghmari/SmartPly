using System.Security.Claims;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("notifications")]
[EnableRateLimiting("fixed")]
public class NotificationController(
    NotificationService notificationService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginationResultDto<NotificationResponseDto>>> GetNotifications(
        [FromQuery] NotificationQueryParameters query,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        PaginationResultDto<NotificationResponseDto> result = await notificationService.GetNotificationsAsync(userId, query, cancellationToken);
        
        return Ok(result);
    }

    [HttpPost("mark-as-read")]
    public async Task<IActionResult> MarkNotificationsAsRead(
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        await notificationService.MarkNotificationsAsReadAsync(userId, cancellationToken);
        
        return NoContent();
    }

    [HttpPost("{id}/mark-as-read")]
    public async Task<IActionResult> MarkNotificationAsRead(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        await notificationService.MarkNotificationAsReadAsync(id, userId, cancellationToken);
        
        return NoContent();
    }
}