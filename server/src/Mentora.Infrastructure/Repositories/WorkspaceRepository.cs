using Microsoft.EntityFrameworkCore;
using Mentora.Domain.Common;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;
using Mentora.Infrastructure.Data;

namespace Mentora.Infrastructure.Repositories;

public class WorkspaceRepository(MentoraDbContext _context) : IWorkspaceRepository
{
    public async Task<Workspace?> GetByIdAsync(Guid id)
    {
        return await _context.Workspaces.FirstOrDefaultAsync(w => w.Id == id);
    }

    public async Task<PagedResult<Workspace>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default)
    {
        var query = _context.Workspaces.AsNoTracking();

        query = (pagination.SortBy?.ToLowerInvariant(), pagination.SortDescending) switch
        {
            ("name", false) => query.OrderBy(w => w.Name),
            ("name", true) => query.OrderByDescending(w => w.Name),
            ("active", false) => query.OrderBy(w => w.Active),
            ("active", true) => query.OrderByDescending(w => w.Active),
            ("createdat", false) => query.OrderBy(w => w.CreatedAt),
            ("createdat", true) => query.OrderByDescending(w => w.CreatedAt),
            _ => query.OrderBy(w => w.Name)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Workspace>
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
}
