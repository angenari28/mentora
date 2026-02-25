using Mentora.Domain;

namespace Mentora.Domain.Entities;

public class ClassStudent : EntityGuidBase
{
    public Guid UserId { get; set; }
    public Guid ClassId { get; set; }
    public bool Active { get; set; }

    public User User { get; set; } = null!;
    public Class Class { get; set; } = null!;
}
