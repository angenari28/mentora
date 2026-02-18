namespace Mentora.Domain.Entities;

public class Class : EntityGuidBase
{
    public string Name { get; set; } = string.Empty;
    public DateTime DateStart { get; set; }
    public DateTime DateEnd { get; set; }
    public bool Active { get; set; }
}

