namespace Mentora.Domain.Entities;

public class CourseSlideTime : EntityGuidBase
{
    public Guid UserId { get; set; }
    public Guid CourseSlideId { get; set; }
    public DateTime DateStart { get; set; }
    public DateTime? DateEnd { get; set; }

    public CourseSlide CourseSlide { get; set; } = null!;
}
