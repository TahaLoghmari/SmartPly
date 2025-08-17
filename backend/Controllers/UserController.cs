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
    [HttpDelete]
    public async Task<IActionResult> DeleteCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        await userService.DeleteUserAsync(userId);
        
        return NoContent();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateUser(
        [FromBody] UserRequestDto dto,
        [FromServices] IValidator<UserRequestDto> validator)
    {
        await validator.ValidateAndThrowAsync(dto);
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        await userService.UpdateUserAsync(dto,userId);
        
        return NoContent();
    }
}