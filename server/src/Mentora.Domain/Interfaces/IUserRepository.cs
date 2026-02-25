using Mentora.Domain.Entities;
using Mentora.Domain.Common;

namespace Mentora.Domain.Interfaces;

public interface IUserRepository : IPagedRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(Guid id);
    Task<IEnumerable<User>> GetAllAsync();
    Task<User> AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(Guid id);
}
