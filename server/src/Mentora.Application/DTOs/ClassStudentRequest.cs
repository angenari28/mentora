namespace Mentora.Application.DTOs;

public record ClassStudentRequest
{
    public Guid UserId { get; init; }
    public Guid ClassId { get; init; }
    public bool Active { get; init; }
}
