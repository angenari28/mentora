namespace Mentora.Application.DTOs;

public record CategoryRequest
{
    public Guid WorkspaceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool Active { get; set; } = true;
}
