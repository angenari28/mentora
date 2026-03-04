using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class ClassService(IClassRepository _classRepository) : IClassService
{
    public async Task<PagedResult<ClassResponse>> GetPagedAsync(PaginationParams pagination)
    {
        var paged = await _classRepository.GetPagedAsync(pagination);
        return new()
        {
            Items = [.. paged.Items.Select(ToResponse)],
            Meta = paged.Meta
        };
    }

    public async Task<ClassResponse?> GetByIdAsync(Guid id)
    {
        var @class = await _classRepository.GetByIdAsync(id);
        return @class is null ? null : ToResponse(@class);
    }

    public async Task<IEnumerable<ClassResponse>> GetByWorkspaceIdAsync(Guid workspaceId)
    {
        var classes = await _classRepository.GetByWorkspaceIdAsync(workspaceId);
        return classes.Select(ToResponse).ToList();
    }

    public async Task<IEnumerable<ClassResponse>> GetByCourseIdAsync(Guid courseId)
    {
        var classes = await _classRepository.GetByCourseIdAsync(courseId);
        return classes.Select(ToResponse).ToList();
    }

    public async Task<ClassResponse> CreateAsync(ClassRequest request)
    {
        var @class = new Class
        {
            WorkspaceId = request.WorkspaceId,
            CourseId = request.CourseId,
            Name = request.Name,
            DateStart = request.DateStart.ToUniversalTime(),
            DateEnd = request.DateEnd.ToUniversalTime(),
            Active = request.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _classRepository.CreateAsync(@class);
        return ToResponse(created);
    }

    public async Task<ClassResponse?> UpdateAsync(Guid id, ClassRequest request)
    {
        var @class = await _classRepository.GetByIdAsync(id);
        if (@class is null) return null;

        @class.WorkspaceId = request.WorkspaceId;
        @class.CourseId = request.CourseId;
        @class.Name = request.Name;
        @class.DateStart = request.DateStart.ToUniversalTime();
        @class.DateEnd = request.DateEnd.ToUniversalTime();
        @class.Active = request.Active;
        @class.UpdatedAt = DateTime.UtcNow;

        var updated = await _classRepository.UpdateAsync(@class);
        return ToResponse(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _classRepository.DeleteAsync(id);
    }

    private static ClassResponse ToResponse(Class c) => new()
    {
        Id = c.Id,
        WorkspaceId = c.WorkspaceId,
        CourseId = c.CourseId,
        CourseName = c.Course?.Name ?? string.Empty,
        Name = c.Name,
        DateStart = c.DateStart,
        DateEnd = c.DateEnd,
        Active = c.Active,
        CreatedAt = c.CreatedAt,
        UpdatedAt = c.UpdatedAt
    };
}
