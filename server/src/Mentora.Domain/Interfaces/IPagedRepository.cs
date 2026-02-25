using Mentora.Domain.Common;

namespace Mentora.Domain.Interfaces;

public interface IPagedRepository<T>
{
    Task<PagedResult<T>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default);
}
