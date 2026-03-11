using Mentora.Domain.Entities;

namespace Mentora.Domain.Interfaces;

public interface ISlideTypeRepository
{
    Task<IEnumerable<SlideType>> GetAllAsync();
    Task<SlideType?> GetByIdAsync(Guid id);
}
