using Mentora.Application.DTOs;

namespace Mentora.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
}
