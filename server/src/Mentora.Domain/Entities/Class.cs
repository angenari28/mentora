namespace Mentora.Domain.Entities;

public class Class : EntityGuidBase
{
    public Guid WorkspaceId { get; set; }
    public Guid CourseId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime DateStart { get; set; }
    public DateTime DateEnd { get; set; }
    public bool Active { get; set; }
    public Workspace Workspace { get; set; } = null!;
    public Course Course { get; set; } = null!;
}

