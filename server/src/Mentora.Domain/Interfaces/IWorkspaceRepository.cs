using Mentora.Domain.Entities;

namespace Mentora.Domain.Interfaces;

public interface IWorkspaceRepository : IPagedRepository<Workspace>
{
    Task<Workspace?> GetByIdAsync(Guid id);
    Task<Workspace> CreateAsync(Workspace workspace);
    Task<Workspace> UpdateAsync(Workspace workspace);
    Task<bool> DeleteAsync(Guid id);
}