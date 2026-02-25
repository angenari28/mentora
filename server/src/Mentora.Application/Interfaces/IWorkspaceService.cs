using Mentora.Domain.Common;
using Mentora.Domain.Entities;

namespace Mentora.Application.Interfaces;

public interface IWorkspaceService
{
    Task<PagedResult<Workspace>> GetPagedResultAsync(PaginationParams pagination);
    Task<Workspace?> GetWorkspaceByIdAsync(Guid id);
}
