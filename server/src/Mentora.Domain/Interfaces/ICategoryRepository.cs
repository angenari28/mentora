using Mentora.Domain.Entities;

namespace Mentora.Domain.Interfaces;

public interface ICategoryRepository : IPagedRepository<Category>
{
    Task<Category?> GetByIdAsync(Guid id);
    Task<IEnumerable<Category>> GetByWorkspaceIdAsync(Guid workspaceId);
    Task<Category> CreateAsync(Category category);
    Task<Category> UpdateAsync(Category category);
}
