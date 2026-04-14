namespace Mentora.Application.DTOs;

public record DashboardResponse
{
    public int ActiveUsers { get; init; }
    public int ActiveCourses { get; init; }
    public int ActiveClasses { get; init; }
    public int CompletedClasses { get; init; }
    public IReadOnlyList<RecentActivityResponse> RecentActivities { get; init; } = [];
}

public record RecentActivityResponse
{
    public string UserName { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}
