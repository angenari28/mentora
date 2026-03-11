using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class SlideTypeService(ISlideTypeRepository _slideTypeRepository) : ISlideTypeService
{
    public async Task<IEnumerable<SlideTypeResponse>> GetAllAsync()
    {
        var slideTypes = await _slideTypeRepository.GetAllAsync();
        return slideTypes.Select(s => new SlideTypeResponse
        {
            Id = s.Id,
            Name = s.Name,
            Icon = s.Icon,
            Active = s.Active
        });
    }
}
