using backend.DTOs;
using backend.Entities;

namespace backend.Mappings;

internal static class UserMappings
{
    public static UserDto toUserDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email!,
            Name = user.Name!,
            ImageUrl = user.ImageUrl!
        };
    }
}