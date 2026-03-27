namespace Mentora.Application.DTOs;

public record CourseSlideTimeCreateRequest
{
    public Guid UserId { get; init; }
    public Guid CourseSlideId { get; init; }
    public DateTime DateStart { get; init; }
}

public record CourseSlideTimeEndRequest
{
    public DateTime DateEnd { get; init; }
}
