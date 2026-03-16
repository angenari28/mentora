using Mentora.Application.DTOs;
using Mentora.Domain.Common;

namespace Mentora.Application.Interfaces;

public interface ICourseService
{
    Task<PagedResult<CourseResponse>> GetPagedAsync(PaginationParams pagination);
    Task<CourseResponse?> GetByIdAsync(Guid id);
    Task<IEnumerable<CourseResponse>> GetByCategoryIdAsync(Guid categoryId);
    Task<CourseResponse> CreateAsync(CourseRequest request);
    Task<CourseResponse?> UpdateAsync(Guid id, CourseRequest request);
    Task<bool> DeleteAsync(Guid id);
}
