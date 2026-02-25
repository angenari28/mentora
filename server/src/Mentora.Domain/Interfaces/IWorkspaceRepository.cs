using Mentora.Domain.Entities;

namespace Mentora.Domain.Interfaces;

public interface IWorkspaceRepository : IPagedRepository<Workspace>
{
    Task<Workspace?> GetByIdAsync(Guid id);
}