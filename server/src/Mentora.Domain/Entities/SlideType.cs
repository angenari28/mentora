using Mentora.Domain;

namespace Mentora.Domain.Entities;

public class SlideType : EntityGuidBase
{
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public bool Active { get; set; }
}
