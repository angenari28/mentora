using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class WorkspaceService(IWorkspaceRepository _workspaceRepository) : IWorkspaceService
{
    public async Task<PagedResult<WorkspaceResponse>> GetPagedResultAsync(PaginationParams pagination)
    {
        var paged = await _workspaceRepository.GetPagedAsync(pagination);
        return new()
        {
            Items = [.. paged.Items.Select(ToResponse)],
            Meta = paged.Meta
        };
    }

    public async Task<WorkspaceResponse?> GetWorkspaceByIdAsync(Guid id)
    {
        var workspace = await _workspaceRepository.GetByIdAsync(id);
        return workspace is null ? null : ToResponse(workspace);
    }

    public async Task<WorkspaceResponse> CreateAsync(WorkspaceRequest request)
    {
        var workspace = new Workspace
        {
            Name = request.Name,
            Logo = request.Logo,
            PrimaryColor = request.PrimaryColor,
            SecondaryColor = request.SecondaryColor,
            BigBanner = request.BigBanner,
            SmallBanner = request.SmallBanner,
            Active = request.Active,
            Url = request.Url,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _workspaceRepository.CreateAsync(workspace);
        return ToResponse(created);
    }

    public async Task<WorkspaceResponse?> UpdateAsync(Guid id, WorkspaceRequest request)
    {
        var workspace = await _workspaceRepository.GetByIdAsync(id);
        if (workspace is null) return null;

        workspace.Name = request.Name;
        workspace.Logo = request.Logo;
        workspace.PrimaryColor = request.PrimaryColor;
        workspace.SecondaryColor = request.SecondaryColor;
        workspace.BigBanner = request.BigBanner;
        workspace.SmallBanner = request.SmallBanner;
        workspace.Active = request.Active;
        workspace.Url = request.Url;
        workspace.UpdatedAt = DateTime.UtcNow;

        var updated = await _workspaceRepository.UpdateAsync(workspace);
        return ToResponse(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _workspaceRepository.DeleteAsync(id);
    }

    private static WorkspaceResponse ToResponse(Workspace w) => new()
    {
        Id = w.Id,
        Name = w.Name,
        Logo = w.Logo,
        PrimaryColor = w.PrimaryColor,
        SecondaryColor = w.SecondaryColor,
        BigBanner = w.BigBanner,
        SmallBanner = w.SmallBanner,
        Active = w.Active,
        Url = w.Url,
        CreatedAt = w.CreatedAt,
        UpdatedAt = w.UpdatedAt
    };
}
