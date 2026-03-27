using Microsoft.EntityFrameworkCore;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;
using Mentora.Infrastructure.Data;

namespace Mentora.Infrastructure.Repositories;

public class CourseSlideTimeRepository(MentoraDbContext _context) : ICourseSlideTimeRepository
{
    public async Task<IEnumerable<CourseSlideTime>> GetBySlideIdsAsync(IEnumerable<Guid> slideIds, Guid userId)
        => await _context.CourseSlidesTimes
            .AsNoTracking()
            .Where(t => slideIds.Contains(t.CourseSlideId) && t.UserId == userId)
            .ToListAsync();

    public async Task<CourseSlideTime?> GetByIdAsync(Guid id)
        => await _context.CourseSlidesTimes.FindAsync(id);

    public async Task<CourseSlideTime> CreateAsync(CourseSlideTime entity)
    {
        _context.CourseSlidesTimes.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<CourseSlideTime> UpdateAsync(CourseSlideTime entity)
    {
        _context.CourseSlidesTimes.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }
}
