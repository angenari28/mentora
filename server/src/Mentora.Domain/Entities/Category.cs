namespace Mentora.Domain.Entities;

public class Category : EntityGuidBase
{
    public Guid WorkspaceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool Active { get; set; }
    public Workspace Workspace { get; set; } = null!;
}