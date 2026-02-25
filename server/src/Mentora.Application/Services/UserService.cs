using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class UserService(IUserRepository _userRepository) : IUserService
{
    public async Task<IEnumerable<UserData>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        
        return users.Select(u => new UserData
        {
            Id = u.Id,
            Email = u.Email,
            Name = u.Name,
            Role = u.Role.ToString(),
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt,
            LastLoginAt = u.LastLoginAt
        }).ToList();
    }

    public async Task<UserData?> GetUserByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        
        if (user == null)
            return null;

        return new UserData
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role.ToString(),
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            LastLoginAt = user.LastLoginAt
        };
    }
}

