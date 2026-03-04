using Mentora.Application.Common;
using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;
using Mentora.Domain.Entities;
using Mentora.Domain.Enums;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class UserService(IUserRepository _userRepository) : IUserService
{
    public async Task<PagedResult<UserResponse>> GetPagedResult(PaginationParams pagination)
    {
        var users = await _userRepository.GetPagedAsync(pagination);

        return new PagedResult<UserResponse>
        {
            Items = [.. users.Items.Select(MapToResponse)],
            Meta = users.Meta
        };
    }

    public async Task<UserResponse?> GetUserByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user is null) return null;
        return MapToResponse(user);
    }

    public async Task<UserResponse> CreateAsync(UserRequest request)
    {
        var role = Enum.TryParse<UserRole>(request.Role, true, out var parsedRole)
            ? parsedRole
            : UserRole.Student;

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = PasswordHasher.Hash(request.Password),
            Role = role,
            IsActive = request.IsActive,
            WorkspaceId = request.WorkspaceId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _userRepository.AddAsync(user);
        var withWorkspace = await _userRepository.GetByIdAsync(created.Id);
        return MapToResponse(withWorkspace!);
    }

    public async Task<UserResponse?> UpdateAsync(Guid id, UserRequest request)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user is null) return null;

        var role = Enum.TryParse<UserRole>(request.Role, true, out var parsedRole)
            ? parsedRole
            : UserRole.Student;

        user.Name = request.Name;
        user.Email = request.Email;
        if (!string.IsNullOrWhiteSpace(request.Password))
            user.PasswordHash = PasswordHasher.Hash(request.Password);
        user.Role = role;
        user.IsActive = request.IsActive;
        user.WorkspaceId = request.WorkspaceId;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);
        var updated = await _userRepository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user is null) return false;

        await _userRepository.DeleteAsync(id);
        return true;
    }

    private static UserResponse MapToResponse(User user) => new()
    {
        Id = user.Id,
        Email = user.Email,
        Name = user.Name,
        Role = user.Role.ToString(),
        IsActive = user.IsActive,
        CreatedAt = user.CreatedAt,
        UpdatedAt = user.UpdatedAt,
        LastLoginAt = user.LastLoginAt,
        Workspace = user.Workspace is null ? null! : new WorkspaceResponse
        {
            Id = user.Workspace.Id,
            Name = user.Workspace.Name,
            Logo = user.Workspace.Logo,
            PrimaryColor = user.Workspace.PrimaryColor,
            SecondaryColor = user.Workspace.SecondaryColor,
            BigBanner = user.Workspace.BigBanner,
            SmallBanner = user.Workspace.SmallBanner,
            Active = user.Workspace.Active,
            Url = user.Workspace.Url
        }
    };
}

