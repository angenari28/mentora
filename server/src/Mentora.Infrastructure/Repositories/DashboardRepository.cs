using Microsoft.EntityFrameworkCore;
using Mentora.Domain.Interfaces;
using Mentora.Infrastructure.Data;

namespace Mentora.Infrastructure.Repositories;

public class DashboardRepository(MentoraDbContext _context) : IDashboardRepository
{
    public async Task<int> GetActiveUsersCountAsync(Guid workspaceId, CancellationToken cancellationToken = default)
        => await _context.Users.CountAsync(u => u.WorkspaceId == workspaceId && u.IsActive, cancellationToken);

    public async Task<int> GetActiveCoursesCountAsync(Guid workspaceId, CancellationToken cancellationToken = default)
        => await _context.Courses.CountAsync(c => c.WorkspaceId == workspaceId && c.Active, cancellationToken);

    public async Task<int> GetActiveClassesCountAsync(Guid workspaceId, CancellationToken cancellationToken = default)
        => await _context.Classes.CountAsync(c => c.WorkspaceId == workspaceId && c.Active, cancellationToken);

    public async Task<int> GetCompletedClassesCountAsync(Guid workspaceId, CancellationToken cancellationToken = default)
        => await _context.Classes.CountAsync(c => c.WorkspaceId == workspaceId && c.DateEnd < DateTime.UtcNow, cancellationToken);

    public async Task<IReadOnlyList<(string Name, DateTime CreatedAt)>> GetRecentUserRegistrationsAsync(Guid workspaceId, int limit = 10, CancellationToken cancellationToken = default)
    {
        var users = await _context.Users
            .AsNoTracking()
            .Where(u => u.WorkspaceId == workspaceId && u.IsActive && u.Role != Domain.Enums.UserRoleEnum.Master)
            .OrderByDescending(u => u.CreatedAt)
            .Take(limit)
            .Select(u => new { u.Name, u.CreatedAt })
            .ToListAsync(cancellationToken);

        return users.Select(u => (u.Name, u.CreatedAt)).ToList().AsReadOnly();
    }
}
