using Microsoft.EntityFrameworkCore;
using Mentora.Domain.Common;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;
using Mentora.Infrastructure.Data;

namespace Mentora.Infrastructure.Repositories;

public class ClassRepository(MentoraDbContext _context) : IClassRepository
{
    public async Task<Class?> GetByIdAsync(Guid id)
    {
        return await _context.Classes
            .Include(c => c.Course)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Class>> GetByWorkspaceIdAsync(Guid workspaceId)
    {
        return await _context.Classes
            .Include(c => c.Course)
            .AsNoTracking()
            .Where(c => c.WorkspaceId == workspaceId)
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Class>> GetByCourseIdAsync(Guid courseId)
    {
        return await _context.Classes
            .Include(c => c.Course)
            .AsNoTracking()
            .Where(c => c.CourseId == courseId)
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<PagedResult<Class>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default)
    {
        var query = _context.Classes
            .Include(c => c.Course)
            .AsNoTracking();

        if (pagination.WorkspaceId.HasValue)
            query = query.Where(c => c.WorkspaceId == pagination.WorkspaceId.Value);

        query = (pagination.SortBy?.ToLowerInvariant(), pagination.SortDescending) switch
        {
            ("name", false) => query.OrderBy(c => c.Name),
            ("name", true) => query.OrderByDescending(c => c.Name),
            ("datestart", false) => query.OrderBy(c => c.DateStart),
            ("datestart", true) => query.OrderByDescending(c => c.DateStart),
            ("dateend", false) => query.OrderBy(c => c.DateEnd),
            ("dateend", true) => query.OrderByDescending(c => c.DateEnd),
            ("active", false) => query.OrderBy(c => c.Active),
            ("active", true) => query.OrderByDescending(c => c.Active),
            ("createdat", false) => query.OrderBy(c => c.CreatedAt),
            ("createdat", true) => query.OrderByDescending(c => c.CreatedAt),
            _ => query.OrderBy(c => c.Name)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Class>
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

    public async Task<Class> CreateAsync(Class @class)
    {
        _context.Classes.Add(@class);
        await _context.SaveChangesAsync();
        return @class;
    }

    public async Task<Class> UpdateAsync(Class @class)
    {
        _context.Classes.Update(@class);
        await _context.SaveChangesAsync();
        return @class;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var @class = await _context.Classes.FindAsync(id);
        if (@class is null) return false;

        _context.Classes.Remove(@class);
        await _context.SaveChangesAsync();
        return true;
    }
}
