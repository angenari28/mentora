using Mentora.Domain.Entities;
using Mentora.Domain.Common;
using Mentora.Domain.Enums;

namespace Mentora.Domain.Interfaces;

public interface IUserRepository : IPagedRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(Guid id);
    Task<IEnumerable<User>> GetAllAsync();
    Task<PagedResult<User>> GetPagedByRoleAsync(PaginationParams pagination, UserRoleEnum role, CancellationToken cancellationToken = default);
    Task<User> AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(Guid id);
}
