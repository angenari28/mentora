using Mentora.Application.DTOs;
using Mentora.Domain.Common;

namespace Mentora.Application.Interfaces;

public interface IWorkspaceService
{
    Task<PagedResult<WorkspaceResponse>> GetPagedResultAsync(PaginationParams pagination);
    Task<WorkspaceResponse?> GetWorkspaceByIdAsync(Guid id);
    Task<WorkspaceResponse> CreateAsync(WorkspaceRequest request);
    Task<WorkspaceResponse?> UpdateAsync(Guid id, WorkspaceRequest request);
    Task<bool> DeleteAsync(Guid id);
}
