using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class AuthService(IUserRepository _userRepository) : IAuthService
{
    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        // Busca o usuário no banco de dados
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null)
        {
            return new LoginResponse
            {
                Success = false,
                Message = "Usuário não encontrado"
            };
        }

        if (!user.IsActive)
        {
            return new LoginResponse
            {
                Success = false,
                Message = "Usuário inativo"
            };
        }

        // Por enquanto, sempre aceita qualquer senha (validação será implementada posteriormente)
        // Atualiza o último login
        user.LastLoginAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return new LoginResponse
        {
            Success = true,
            Message = "Login realizado com sucesso",
            Token = "mock-token-" + Guid.NewGuid().ToString(),
            User = new UserData
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                LastLoginAt = user.LastLoginAt
            }
        };
    }
}
