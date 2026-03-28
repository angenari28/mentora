using Mentora.Domain.Entities;

namespace Mentora.Domain.Interfaces;

public interface ICourseSlideTimeRepository
{
    Task<IEnumerable<CourseSlideTime>> GetBySlideIdsAsync(IEnumerable<Guid> slideIds, Guid userId);
    Task<CourseSlideTime> CreateAsync(CourseSlideTime entity);
    Task<CourseSlideTime?> GetByIdAsync(Guid id);
    Task<CourseSlideTime> UpdateAsync(CourseSlideTime entity);
    Task<int> DeleteByCourseAndUserAsync(Guid courseId, Guid userId);
}
