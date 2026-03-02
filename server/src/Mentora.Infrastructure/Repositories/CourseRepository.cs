using Microsoft.EntityFrameworkCore;
using Mentora.Domain.Common;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;
using Mentora.Infrastructure.Data;

namespace Mentora.Infrastructure.Repositories;

public class CourseRepository(MentoraDbContext _context) : ICourseRepository
{
    public async Task<Course?> GetByIdAsync(Guid id)
    {
        return await _context.Courses.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Course?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _context.Courses.AsNoTracking()
            .Include(c => c.Category)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Course>> GetByCategoryIdAsync(Guid categoryId)
    {
        return await _context.Courses.AsNoTracking()
            .Include(c => c.Category)
            .Where(c => c.CategoryId == categoryId)
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<PagedResult<Course>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default)
    {
        var query = _context.Courses.AsNoTracking()
            .Include(c => c.Category);

        var ordered = (pagination.SortBy?.ToLowerInvariant(), pagination.SortDescending) switch
        {
            ("name", false) => query.OrderBy(c => c.Name),
            ("name", true) => query.OrderByDescending(c => c.Name),
            ("active", false) => query.OrderBy(c => c.Active),
            ("active", true) => query.OrderByDescending(c => c.Active),
            ("createdat", false) => query.OrderBy(c => c.CreatedAt),
            ("createdat", true) => query.OrderByDescending(c => c.CreatedAt),
            _ => query.OrderBy(c => c.Name)
        };

        var totalCount = await ordered.CountAsync(cancellationToken);
        var items = await ordered
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Course>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pagination.PageNumber,
            PageSize = pagination.PageSize
        };
    }

    public async Task<Course> CreateAsync(Course course)
    {
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        return course;
    }

    public async Task<Course> UpdateAsync(Course course)
    {
        _context.Courses.Update(course);
        await _context.SaveChangesAsync();
        return course;
    }
}
