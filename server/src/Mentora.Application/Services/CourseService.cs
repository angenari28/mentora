using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class CourseService(ICourseRepository _courseRepository) : ICourseService
{
    public async Task<PagedResult<CourseResponse>> GetPagedAsync(PaginationParams pagination)
    {
        var paged = await _courseRepository.GetPagedAsync(pagination);
        return new PagedResult<CourseResponse>
        {
            Items = (IReadOnlyList<CourseResponse>)paged.Items.Select(ToResponse),
            TotalCount = paged.TotalCount,
            PageNumber = paged.PageNumber,
            PageSize = paged.PageSize
        };
    }

    public async Task<CourseResponse?> GetByIdAsync(Guid id)
    {
        var course = await _courseRepository.GetByIdWithDetailsAsync(id);
        return course is null ? null : ToResponse(course);
    }

    public async Task<IEnumerable<CourseResponse>> GetByCategoryIdAsync(Guid categoryId)
    {
        var courses = await _courseRepository.GetByCategoryIdAsync(categoryId);
        return courses.Select(ToResponse);
    }

    public async Task<CourseResponse> CreateAsync(CourseRequest request)
    {
        var course = new Course
        {
            Id = Guid.NewGuid(),
            CategoryId = request.CategoryId,
            WorkspaceId = request.WorkspaceId,
            Name = request.Name,
            ShowCertificate = request.ShowCertificate,
            Active = request.Active,
            FaceImage = request.FaceImage,
            CertificateImage = request.CertificateImage,
            WorkloadHours = request.WorkloadHours,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _courseRepository.CreateAsync(course);
        return ToResponse(created);
    }

    public async Task<CourseResponse?> UpdateAsync(Guid id, CourseRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course is null) return null;

        course.CategoryId = request.CategoryId;
        course.WorkspaceId = request.WorkspaceId;
        course.Name = request.Name;
        course.ShowCertificate = request.ShowCertificate;
        course.Active = request.Active;
        course.FaceImage = request.FaceImage;
        course.CertificateImage = request.CertificateImage;
        course.WorkloadHours = request.WorkloadHours;
        course.UpdatedAt = DateTime.UtcNow;

        var updated = await _courseRepository.UpdateAsync(course);
        return ToResponse(updated);
    }

    private static CourseResponse ToResponse(Course c) => new()
    {
        Id = c.Id,
        CategoryId = c.CategoryId,
        CategoryName = c.Category?.Name ?? string.Empty,
        WorkspaceId = c.WorkspaceId,
        Name = c.Name,
        ShowCertificate = c.ShowCertificate,
        Active = c.Active,
        FaceImage = c.FaceImage,
        CertificateImage = c.CertificateImage,
        WorkloadHours = c.WorkloadHours,
        CreatedAt = c.CreatedAt,
        UpdatedAt = c.UpdatedAt
    };
}
