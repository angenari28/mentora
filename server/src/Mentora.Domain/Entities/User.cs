using Mentora.Domain.Enums;

namespace Mentora.Domain.Entities;

public class User : EntityGuidBase
{
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Aluno;
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
}
