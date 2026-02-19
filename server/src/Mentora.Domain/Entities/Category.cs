namespace Mentora.Domain.Entities;

public class Category : EntityGuidBase
{
    public string Name { get; set; } = string.Empty;
    public bool Active { get; set; }
}