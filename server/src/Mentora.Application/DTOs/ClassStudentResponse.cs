namespace Mentora.Application.DTOs;

public record ClassStudentResponse
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public Guid ClassId { get; init; }
    public string UserName { get; init; } = string.Empty;
    public string UserEmail { get; init; } = string.Empty;
    public string ClassName { get; init; } = string.Empty;
    public string CourseName { get; init; } = string.Empty;
    public bool Active { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}
