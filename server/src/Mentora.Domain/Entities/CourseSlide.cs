using Mentora.Domain;

namespace Mentora.Domain.Entities;

public class CourseSlide : EntityGuidBase
{
    public Guid CourseId { get; set; }
    public Guid SlideTypeId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int Ordering { get; set; }
    public bool Active { get; set; }

    public Course Course { get; set; } = null!;
    public SlideType SlideType { get; set; } = null!;
}
