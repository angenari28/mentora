namespace Mentora.Application.DTOs;

public record CourseSlideRequest
{
    public Guid CourseId { get; set; }
    public Guid SlideTypeId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int Ordering { get; set; }
    public bool Active { get; set; } = true;
}
