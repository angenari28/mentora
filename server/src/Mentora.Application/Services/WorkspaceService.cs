using Mentora.Application.Interfaces;
using Mentora.Domain.Common;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class WorkspaceService(IWorkspaceRepository _workspaceRepository) : IWorkspaceService
{
    public async Task<PagedResult<Workspace>> GetPagedResultAsync(PaginationParams pagination)
    {
        return await _workspaceRepository.GetPagedAsync(pagination);
    }

    public async Task<Workspace?> GetWorkspaceByIdAsync(Guid id)
    {
        return await _workspaceRepository.GetByIdAsync(id);
    }
}
