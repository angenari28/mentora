using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class CategoryService(ICategoryRepository _categoryRepository) : ICategoryService
{
    public async Task<PagedResult<CategoryResponse>> GetPagedAsync(PaginationParams pagination)
    {
        var paged = await _categoryRepository.GetPagedAsync(pagination);
        return new PagedResult<CategoryResponse>
        {
            Items = [.. paged.Items.Select(ToResponse)],
            TotalCount = paged.TotalCount,
            PageNumber = paged.PageNumber,
            PageSize = paged.PageSize
        };
    }

    public async Task<CategoryResponse?> GetByIdAsync(Guid id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        return category is null ? null : ToResponse(category);
    }

    public async Task<IEnumerable<CategoryResponse>> GetByWorkspaceIdAsync(Guid workspaceId)
    {
        var categories = await _categoryRepository.GetByWorkspaceIdAsync(workspaceId);
        return categories.Select(ToResponse).ToList();
    }

    public async Task<CategoryResponse> CreateAsync(CategoryRequest request)
    {
        var category = new Category
        {
            WorkspaceId = request.WorkspaceId,
            Name = request.Name,
            Active = request.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _categoryRepository.CreateAsync(category);
        return ToResponse(created);
    }

    public async Task<CategoryResponse?> UpdateAsync(Guid id, CategoryRequest request)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category is null) return null;

        category.WorkspaceId = request.WorkspaceId;
        category.Name = request.Name;
        category.Active = request.Active;
        category.UpdatedAt = DateTime.UtcNow;

        var updated = await _categoryRepository.UpdateAsync(category);
        return ToResponse(updated);
    }

    private static CategoryResponse ToResponse(Category c) => new()
    {
        Id = c.Id,
        WorkspaceId = c.WorkspaceId,
        Name = c.Name,
        Active = c.Active,
        CreatedAt = c.CreatedAt,
        UpdatedAt = c.UpdatedAt
    };
}
