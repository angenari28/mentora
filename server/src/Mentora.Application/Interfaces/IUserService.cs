using Mentora.Application.DTOs;
using Mentora.Domain.Common;

namespace Mentora.Application.Interfaces;

public interface IUserService
{
    Task<PagedResult<UserResponse>> GetPagedResult(PaginationParams pagination);
    Task<UserResponse?> GetUserByIdAsync(Guid id);
}

