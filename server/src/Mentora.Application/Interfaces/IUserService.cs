using Mentora.Application.DTOs;

namespace Mentora.Application.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserData>> GetAllUsersAsync();
    Task<UserData?> GetUserByIdAsync(Guid id);
}

