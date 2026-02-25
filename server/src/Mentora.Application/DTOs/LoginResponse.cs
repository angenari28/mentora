namespace Mentora.Application.DTOs;

public record LoginResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Token { get; set; }
    public UserResponse? User { get; set; }
}
