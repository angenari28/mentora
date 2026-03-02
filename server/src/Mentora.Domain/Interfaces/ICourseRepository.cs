using Mentora.Domain.Entities;

namespace Mentora.Domain.Interfaces;

public interface ICourseRepository : IPagedRepository<Course>
{
    Task<Course?> GetByIdAsync(Guid id);
    Task<Course?> GetByIdWithDetailsAsync(Guid id);
    Task<IEnumerable<Course>> GetByCategoryIdAsync(Guid categoryId);
    Task<Course> CreateAsync(Course course);
    Task<Course> UpdateAsync(Course course);
}
