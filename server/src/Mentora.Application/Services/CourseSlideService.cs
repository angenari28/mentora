using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class CourseSlideService(ICourseSlideRepository _courseSlideRepository) : ICourseSlideService
{
    public async Task<IEnumerable<CourseSlideResponse>> GetByCourseIdAsync(Guid courseId)
    {
        var slides = await _courseSlideRepository.GetByCourseIdAsync(courseId);
        return slides.Select(ToResponse);
    }

    public async Task<CourseSlideResponse?> GetByIdAsync(Guid id)
    {
        var slide = await _courseSlideRepository.GetByIdAsync(id);
        return slide is null ? null : ToResponse(slide);
    }

    public async Task<CourseSlideResponse> CreateAsync(CourseSlideRequest request)
    {
        var slide = new CourseSlide
        {
            Id = Guid.CreateVersion7(),
            CourseId = request.CourseId,
            SlideTypeId = request.SlideTypeId,
            Title = request.Title,
            Content = request.Content,
            Ordering = request.Ordering,
            Active = request.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _courseSlideRepository.CreateAsync(slide);
        return ToResponse(created);
    }

    public async Task<CourseSlideResponse?> UpdateAsync(Guid id, CourseSlideRequest request)
    {
        var slide = await _courseSlideRepository.GetByIdAsync(id);
        if (slide is null) return null;

        slide.CourseId = request.CourseId;
        slide.SlideTypeId = request.SlideTypeId;
        slide.Title = request.Title;
        slide.Content = request.Content;
        slide.Ordering = request.Ordering;
        slide.Active = request.Active;
        slide.UpdatedAt = DateTime.UtcNow;

        var updated = await _courseSlideRepository.UpdateAsync(slide);
        return ToResponse(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _courseSlideRepository.DeleteAsync(id);
    }

    public async Task ReorderAsync(CourseSlideReorderRequest request)
    {
        var items = request.Items.Select(i => (i.Id, i.Ordering));
        await _courseSlideRepository.ReorderAsync(items);
    }

    private static CourseSlideResponse ToResponse(CourseSlide s) => new()
    {
        Id = s.Id,
        CourseId = s.CourseId,
        CourseName = s.Course?.Name ?? string.Empty,
        SlideTypeId = s.SlideTypeId,
        SlideTypeName = s.SlideType?.Name ?? string.Empty,
        Title = s.Title,
        Content = s.Content,
        Ordering = s.Ordering,
        Active = s.Active,
        CreatedAt = s.CreatedAt,
        UpdatedAt = s.UpdatedAt
    };
}
