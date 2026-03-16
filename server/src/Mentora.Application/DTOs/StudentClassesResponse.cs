namespace Mentora.Application.DTOs;

public record StudentClassesResponse
{
    public Guid ClassId { get; init; }
    public string ClassName { get; init; } = string.Empty;
    public DateTime DateStart { get; init; }
    public DateTime DateEnd { get; init; }
    public bool ClassActive { get; init; }
    public CourseDetail Course { get; init; } = null!;
}

public record CourseDetail
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string FaceImage { get; init; } = string.Empty;
    public int WorkloadHours { get; init; }
    public bool Active { get; init; }
    public CategoryDetail Category { get; init; } = null!;
    public IEnumerable<SlideDetail> Slides { get; init; } = [];
}

public record CategoryDetail
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
}

public record SlideDetail
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string SlideTypeName { get; init; } = string.Empty;
    public int Ordering { get; init; }
    public bool Active { get; init; }
}
