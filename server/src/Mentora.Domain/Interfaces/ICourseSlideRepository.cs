using Mentora.Domain.Entities;

namespace Mentora.Domain.Interfaces;

public interface ICourseSlideRepository
{
    Task<IEnumerable<CourseSlide>> GetByCourseIdAsync(Guid courseId);
    Task<CourseSlide?> GetByIdAsync(Guid id);
    Task<CourseSlide> CreateAsync(CourseSlide courseSlide);
    Task<CourseSlide> UpdateAsync(CourseSlide courseSlide);
    Task<bool> DeleteAsync(Guid id);
}
