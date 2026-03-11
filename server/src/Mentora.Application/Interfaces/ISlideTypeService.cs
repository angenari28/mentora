using Mentora.Application.DTOs;

namespace Mentora.Application.Interfaces;

public interface ISlideTypeService
{
    Task<IEnumerable<SlideTypeResponse>> GetAllAsync();
}
