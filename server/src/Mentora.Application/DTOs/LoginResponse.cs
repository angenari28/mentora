namespace Mentora.Application.DTOs;

public record LoginResponse
{
    public bool Success { get; set; } = false;
    public string Message { get; set; } = "Usuario ou senha incorretos";
    public string? Token { get; set; }
    public UserResponse? User { get; set; }
}
