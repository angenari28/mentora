using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class UserService(IUserRepository _userRepository) : IUserService
{
    public async Task<PagedResult<UserResponse>> GetPagedResult(PaginationParams pagination)
    {
        var users = await _userRepository.GetPagedAsync(pagination);

        return new PagedResult<UserResponse>
        {
            TotalCount = users.TotalCount,
            PageNumber = users.PageNumber,
            PageSize = users.PageSize,
            Items = [.. users.Items.Select(u => new UserResponse
        {
            Id = u.Id,
            Email = u.Email,
            Name = u.Name,
            Role = u.Role.ToString(),
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt,
            LastLoginAt = u.LastLoginAt,
            Workspace = new WorkspaceResponse
            {
                Id = u.Workspace.Id,
                Name = u.Workspace.Name,
                Logo = u.Workspace.Logo,
                PrimaryColor = u.Workspace.PrimaryColor,
                SecondaryColor = u.Workspace.SecondaryColor,
                BigBanner = u.Workspace.BigBanner,
                SmallBanner = u.Workspace.SmallBanner,
                Active = u.Workspace.Active,
                Url = u.Workspace.Url
            }
        })]
        };
    }

    public async Task<UserResponse?> GetUserByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user == null)
            return null;

        return new UserResponse
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role.ToString(),
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            LastLoginAt = user.LastLoginAt,
            Workspace = new WorkspaceResponse
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
}

