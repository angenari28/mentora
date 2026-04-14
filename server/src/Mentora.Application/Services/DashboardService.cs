using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class DashboardService(IDashboardRepository _dashboardRepository) : IDashboardService
{
    public async Task<DashboardResponse> GetDashboardAsync(Guid workspaceId, CancellationToken cancellationToken = default)
    {
        var activeUsers = await _dashboardRepository.GetActiveUsersCountAsync(workspaceId, cancellationToken);
        var activeCourses = await _dashboardRepository.GetActiveCoursesCountAsync(workspaceId, cancellationToken);
        var activeClasses = await _dashboardRepository.GetActiveClassesCountAsync(workspaceId, cancellationToken);
        var completedClasses = await _dashboardRepository.GetCompletedClassesCountAsync(workspaceId, cancellationToken);
        var recentUsers = await _dashboardRepository.GetRecentUserRegistrationsAsync(workspaceId, 10, cancellationToken);

        var activities = recentUsers
            .Select(u => new RecentActivityResponse
            {
                UserName = u.Name,
                CreatedAt = u.CreatedAt
            })
            .ToList();

        return new DashboardResponse
        {
            ActiveUsers = activeUsers,
            ActiveCourses = activeCourses,
            ActiveClasses = activeClasses,
            CompletedClasses = completedClasses,
            RecentActivities = activities
        };
    }
}
