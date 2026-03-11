using Mentora.Application.DTOs;

namespace Mentora.Application.Interfaces;

public interface ICourseSlideService
{
    Task<IEnumerable<CourseSlideResponse>> GetByCourseIdAsync(Guid courseId);
    Task<CourseSlideResponse?> GetByIdAsync(Guid id);
    Task<CourseSlideResponse> CreateAsync(CourseSlideRequest request);
    Task<CourseSlideResponse?> UpdateAsync(Guid id, CourseSlideRequest request);
    Task<bool> DeleteAsync(Guid id);
}
