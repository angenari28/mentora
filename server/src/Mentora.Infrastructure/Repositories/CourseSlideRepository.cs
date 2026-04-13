using Microsoft.EntityFrameworkCore;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;
using Mentora.Infrastructure.Data;

namespace Mentora.Infrastructure.Repositories;

public class CourseSlideRepository(MentoraDbContext _context) : ICourseSlideRepository
{
    public async Task<IEnumerable<CourseSlide>> GetByCourseIdAsync(Guid courseId)
    {
        return await _context.CourseSlides.AsNoTracking()
            .Include(s => s.Course)
            .Include(s => s.SlideType)
            .Where(s => s.CourseId == courseId)
            .OrderBy(s => s.Ordering)
            .ToListAsync();
    }

    public async Task<CourseSlide?> GetByIdAsync(Guid id)
    {
        return await _context.CourseSlides.AsNoTracking()
            .Include(s => s.Course)
            .Include(s => s.SlideType)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<CourseSlide> CreateAsync(CourseSlide courseSlide)
    {
        _context.CourseSlides.Add(courseSlide);
        await _context.SaveChangesAsync();
        return courseSlide;
    }

    public async Task<CourseSlide> UpdateAsync(CourseSlide courseSlide)
    {
        _context.CourseSlides.Update(courseSlide);
        await _context.SaveChangesAsync();
        return courseSlide;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var slide = await _context.CourseSlides.FindAsync(id);
        if (slide is null) return false;

        _context.CourseSlides.Remove(slide);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task ReorderAsync(IEnumerable<(Guid id, int ordering)> items)
    {
        foreach (var (id, ordering) in items)
        {
            await _context.CourseSlides
                .Where(s => s.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(p => p.Ordering, ordering));
        }
    }
}
