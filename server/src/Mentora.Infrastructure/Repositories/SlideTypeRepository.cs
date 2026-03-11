using Microsoft.EntityFrameworkCore;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;
using Mentora.Infrastructure.Data;

namespace Mentora.Infrastructure.Repositories;

public class SlideTypeRepository(MentoraDbContext _context) : ISlideTypeRepository
{
    public async Task<IEnumerable<SlideType>> GetAllAsync()
    {
        return await _context.SlideTypes.AsNoTracking()
            .Where(s => s.Active)
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<SlideType?> GetByIdAsync(Guid id)
    {
        return await _context.SlideTypes.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id);
    }
}
