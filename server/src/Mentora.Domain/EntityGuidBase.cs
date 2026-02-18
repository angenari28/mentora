namespace Mentora.Domain;

public abstract class EntityGuidBase
{
    public virtual Guid Id { get; set; }
    public virtual DateTime CreatedAt { get; set; }
    public virtual DateTime UpdatedAt { get; set; }
}