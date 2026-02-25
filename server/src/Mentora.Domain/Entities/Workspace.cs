using Mentora.Domain;

namespace Mentora.Domain.Entities;

public class Workspace : EntityGuidBase
{
    public string Name { get; set; } = string.Empty;
    public string Logo { get; set; } = string.Empty;
    public string PrimaryColor { get; set; } = string.Empty;
    public string SecondaryColor { get; set; } = string.Empty;
    public string BigBanner { get; set; } = string.Empty;
    public string SmallBanner { get; set; } = string.Empty;
    public bool Active { get; set; }
    public string Url { get; set; } = string.Empty;
}
