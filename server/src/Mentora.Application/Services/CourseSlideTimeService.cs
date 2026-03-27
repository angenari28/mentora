using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class CourseSlideTimeService(ICourseSlideTimeRepository _repository) : ICourseSlideTimeService
{
    public async Task<CourseSlideTimeResponse> CreateAsync(CourseSlideTimeCreateRequest request)
    {
        var entity = new CourseSlideTime
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            CourseSlideId = request.CourseSlideId,
            DateStart = request.DateStart,
            DateEnd = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _repository.CreateAsync(entity);
        return ToResponse(created);
    }

    public async Task<CourseSlideTimeResponse?> EndAsync(Guid id, CourseSlideTimeEndRequest request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity is null) return null;

        entity.DateEnd = request.DateEnd;
        entity.UpdatedAt = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(entity);
        return ToResponse(updated);
    }

    private static CourseSlideTimeResponse ToResponse(CourseSlideTime e) => new()
    {
        Id = e.Id,
        CourseSlideId = e.CourseSlideId,
        DateStart = e.DateStart,
        DateEnd = e.DateEnd,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };
}
