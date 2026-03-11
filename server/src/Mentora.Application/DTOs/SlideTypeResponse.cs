namespace Mentora.Application.DTOs;

public record SlideTypeResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public bool Active { get; set; }
}
