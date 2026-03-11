using Mentora.Application.Common;
using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Entities;
using Mentora.Domain.Enums;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class AuthService(IUserRepository _userRepository) : IAuthService
{
    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (!IsValidUser(user, request))
            return new();

        if (string.IsNullOrWhiteSpace(user!.PasswordHash) || !PasswordHasher.Verify(request.Password, user.PasswordHash))
            return new();

        user.LastLoginAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return new()
        {
            Success = true,
            User = new()
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                LastLoginAt = user.LastLoginAt,
                Workspace = new()
                {
                    Id = user.Workspace.Id,
                    Name = user.Workspace.Name
                }
            }
        };
    }

    private static bool IsValidUser(User? user, LoginRequest request)
    {
        if (user is null)
            {
                Console.WriteLine($"Falha login: Nenhum usuário encontrado com o email {request.Email}");
                return false;
            }
        if (user.Workspace is null)
            {
                Console.WriteLine($"Falha login: Usuário {request.Email} não pertence a nenhum workspace");
                return false;
            }
        if (!user.Workspace.Active)
            {
                Console.WriteLine($"Falha login: Usuário {request.Email} pertence a um workspace inativo");
                return false;
            }
        if (!user.IsActive)
            {
                Console.WriteLine($"Falha login: Usuário {request.Email} está inativo");
                return false;
            }

        var userRoleFlag = user.Role switch
        {
            UserRoleEnum.Student => LoginAllowedRoles.Student,
            UserRoleEnum.Administrator => LoginAllowedRoles.Administrator,
            UserRoleEnum.Master => LoginAllowedRoles.Master,
            _ => LoginAllowedRoles.None
        };

        if (!request.Role.HasFlag(userRoleFlag))
            {
                Console.WriteLine($"Falha login: Usuário {request.Email} não é ({request.Role})");
                return false;
            }

        return true;
    }
}
