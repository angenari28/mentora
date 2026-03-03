using Mentora.Application.DTOs;
using Mentora.Domain.Common;

namespace Mentora.Application.Interfaces;

public interface IUserService
{
    Task<PagedResult<UserResponse>> GetPagedResult(PaginationParams pagination);
    Task<UserResponse?> GetUserByIdAsync(Guid id);
    Task<UserResponse> CreateAsync(UserRequest request);
    Task<UserResponse?> UpdateAsync(Guid id, UserRequest request);
    Task<bool> DeleteAsync(Guid id);
}

