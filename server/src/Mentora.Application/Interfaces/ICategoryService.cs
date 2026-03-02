using Mentora.Application.DTOs;
using Mentora.Domain.Common;

namespace Mentora.Application.Interfaces;

public interface ICategoryService
{
    Task<PagedResult<CategoryResponse>> GetPagedAsync(PaginationParams pagination);
    Task<CategoryResponse?> GetByIdAsync(Guid id);
    Task<IEnumerable<CategoryResponse>> GetByWorkspaceIdAsync(Guid workspaceId);
    Task<CategoryResponse> CreateAsync(CategoryRequest request);
    Task<CategoryResponse?> UpdateAsync(Guid id, CategoryRequest request);
}
