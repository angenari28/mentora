namespace Mentora.Domain.Interfaces;

public interface IDashboardRepository
{
    Task<int> GetActiveUsersCountAsync(Guid workspaceId, CancellationToken cancellationToken = default);
    Task<int> GetActiveCoursesCountAsync(Guid workspaceId, CancellationToken cancellationToken = default);
    Task<int> GetActiveClassesCountAsync(Guid workspaceId, CancellationToken cancellationToken = default);
    Task<int> GetCompletedClassesCountAsync(Guid workspaceId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<(string Name, DateTime CreatedAt)>> GetRecentUserRegistrationsAsync(Guid workspaceId, int limit = 10, CancellationToken cancellationToken = default);
}
