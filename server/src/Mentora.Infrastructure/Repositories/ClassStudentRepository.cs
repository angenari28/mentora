using Microsoft.EntityFrameworkCore;
using Mentora.Domain.Common;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;
using Mentora.Infrastructure.Data;

namespace Mentora.Infrastructure.Repositories;

public class ClassStudentRepository(MentoraDbContext _context) : IClassStudentRepository
{
    public async Task<ClassStudent?> GetByIdAsync(Guid id)
    {
        return await _context.ClassStudents
            .Include(cs => cs.User)
            .Include(cs => cs.Class)
                .ThenInclude(c => c.Course)
            .AsNoTracking()
            .FirstOrDefaultAsync(cs => cs.Id == id);
    }

    public async Task<IEnumerable<ClassStudent>> GetByClassIdAsync(Guid classId)
    {
        return await _context.ClassStudents
            .Include(cs => cs.User)
            .Include(cs => cs.Class)
                .ThenInclude(c => c.Course)
            .AsNoTracking()
            .Where(cs => cs.ClassId == classId)
            .OrderBy(cs => cs.User.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<ClassStudent>> GetByUserIdAsync(Guid userId)
    {
        return await _context.ClassStudents
            .Include(cs => cs.User)
            .Include(cs => cs.Class)
                .ThenInclude(c => c.Course)
            .AsNoTracking()
            .Where(cs => cs.UserId == userId)
            .OrderBy(cs => cs.Class.Name)
            .ToListAsync();
    }

    public async Task<PagedResult<ClassStudent>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default)
    {
        var query = _context.ClassStudents
            .Include(cs => cs.User)
            .Include(cs => cs.Class)
                .ThenInclude(c => c.Course)
            .AsNoTracking();

        query = (pagination.SortBy?.ToLowerInvariant(), pagination.SortDescending) switch
        {
            ("username", false) => query.OrderBy(cs => cs.User.Name),
            ("username", true) => query.OrderByDescending(cs => cs.User.Name),
            ("classname", false) => query.OrderBy(cs => cs.Class.Name),
            ("classname", true) => query.OrderByDescending(cs => cs.Class.Name),
            ("active", false) => query.OrderBy(cs => cs.Active),
            ("active", true) => query.OrderByDescending(cs => cs.Active),
            ("createdat", false) => query.OrderBy(cs => cs.CreatedAt),
            ("createdat", true) => query.OrderByDescending(cs => cs.CreatedAt),
            _ => query.OrderBy(cs => cs.User.Name)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<ClassStudent>
        {
            Items = items,
            Meta = new PaginationMeta
            {
                TotalCount = totalCount,
                PageNumber = pagination.PageNumber,
                PageSize = pagination.PageSize
            }
        };
    }

    public async Task<ClassStudent> CreateAsync(ClassStudent classStudent)
    {
        _context.ClassStudents.Add(classStudent);
        await _context.SaveChangesAsync();
        return classStudent;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var classStudent = await _context.ClassStudents.FindAsync(id);
        if (classStudent is null) return false;

        _context.ClassStudents.Remove(classStudent);
        await _context.SaveChangesAsync();
        return true;
    }
}
