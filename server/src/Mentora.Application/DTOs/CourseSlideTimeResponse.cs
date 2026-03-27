namespace Mentora.Application.DTOs;

public record CourseSlideTimeResponse
{
    public Guid Id { get; init; }
    public Guid CourseSlideId { get; init; }
    public DateTime DateStart { get; init; }
    public DateTime? DateEnd { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}
