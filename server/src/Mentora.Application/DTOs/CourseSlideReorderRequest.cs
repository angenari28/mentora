namespace Mentora.Application.DTOs;

public class CourseSlideReorderRequest
{
    public List<CourseSlideOrderItem> Items { get; set; } = [];
}

public class CourseSlideOrderItem
{
    public Guid Id { get; set; }
    public int Ordering { get; set; }
}
