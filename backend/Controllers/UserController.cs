using backend.DTOs;
using backend.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("me")]
[Authorize]
public sealed class UserController(
    UserService userService ) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        UserDto userDto = await userService.GetCurrentUser(userId);

        return Ok(userDto);
    }
    
    [HttpDelete]
    public async Task<IActionResult> DeleteCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        await userService.DeleteCurrentUserAsync(userId,HttpContext);
        
        return NoContent();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateCurrentUser(
        [FromBody] UserRequestDto dto,
        [FromServices] IValidator<UserRequestDto> validator)
    {
        await validator.ValidateAndThrowAsync(dto);
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        await userService.UpdateCurrentUserAsync(dto,userId);
        
        return NoContent();
    }
}