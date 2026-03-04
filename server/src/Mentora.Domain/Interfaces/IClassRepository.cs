using Mentora.Domain.Entities;

namespace Mentora.Domain.Interfaces;

public interface IClassRepository : IPagedRepository<Class>
{
    Task<Class?> GetByIdAsync(Guid id);
    Task<IEnumerable<Class>> GetByWorkspaceIdAsync(Guid workspaceId);
    Task<IEnumerable<Class>> GetByCourseIdAsync(Guid courseId);
    Task<Class> CreateAsync(Class @class);
    Task<Class> UpdateAsync(Class @class);
    Task<bool> DeleteAsync(Guid id);
}
