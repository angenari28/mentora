using Mentora.Application.DTOs;

namespace Mentora.Application.Interfaces;

public interface ICourseSlideTimeService
{
    Task<CourseSlideTimeResponse> CreateAsync(CourseSlideTimeCreateRequest request);
    Task<CourseSlideTimeResponse?> EndAsync(Guid id, CourseSlideTimeEndRequest request);
    Task<int> ResetByCourseAndUserAsync(Guid userId, Guid courseId);
}
