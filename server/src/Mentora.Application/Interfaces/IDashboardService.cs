using Mentora.Application.DTOs;

namespace Mentora.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardResponse> GetDashboardAsync(Guid workspaceId, CancellationToken cancellationToken = default);
}
