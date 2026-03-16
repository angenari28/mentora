using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;

namespace Mentora.Application.Services;

public class ClassStudentService(IClassStudentRepository _classStudentRepository) : IClassStudentService
{
    public async Task<PagedResult<ClassStudentResponse>> GetPagedAsync(PaginationParams pagination)
    {
        var paged = await _classStudentRepository.GetPagedAsync(pagination);
        return new()
        {
            Items = [.. paged.Items.Select(ToResponse)],
            Meta = paged.Meta
        };
    }

    public async Task<ClassStudentResponse?> GetByIdAsync(Guid id)
    {
        var cs = await _classStudentRepository.GetByIdAsync(id);
        return cs is null ? null : ToResponse(cs);
    }

    public async Task<ClassStudentResponse> CreateAsync(ClassStudentRequest request)
    {
        var classStudent = new ClassStudent
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            ClassId = request.ClassId,
            Active = request.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _classStudentRepository.CreateAsync(classStudent);
        return ToResponse(created);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _classStudentRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<StudentClassesResponse>> GetClassesByStudentIdAsync(Guid userId)
    {
        var enrollments = await _classStudentRepository.GetClassesWithDetailsByUserIdAsync(userId);
        return enrollments.Select(cs => new StudentClassesResponse
        {
            ClassId = cs.Class.Id,
            ClassName = cs.Class.Name,
            DateStart = cs.Class.DateStart,
            DateEnd = cs.Class.DateEnd,
            ClassActive = cs.Class.Active,
            Course = new CourseDetail
            {
                Id = cs.Class.Course.Id,
                Name = cs.Class.Course.Name,
                FaceImage = cs.Class.Course.FaceImage,
                WorkloadHours = cs.Class.Course.WorkloadHours,
                Active = cs.Class.Course.Active,
                Category = new CategoryDetail
                {
                    Id = cs.Class.Course.Category.Id,
                    Name = cs.Class.Course.Category.Name
                },
                Slides = cs.Class.Course.Slides
                    .Where(s => s.Active)
                    .OrderBy(s => s.Ordering)
                    .Select(s => new SlideDetail
                    {
                        Id = s.Id,
                        Title = s.Title,
                        Content = s.Content,
                        SlideTypeName = s.SlideType?.Name ?? string.Empty,
                        Ordering = s.Ordering,
                        Active = s.Active
                    })
            }
        });
    }

    private static ClassStudentResponse ToResponse(ClassStudent cs) => new()
    {
        Id = cs.Id,
        UserId = cs.UserId,
        ClassId = cs.ClassId,
        UserName = cs.User?.Name ?? string.Empty,
        UserEmail = cs.User?.Email ?? string.Empty,
        ClassName = cs.Class?.Name ?? string.Empty,
        CourseName = cs.Class?.Course?.Name ?? string.Empty,
        Active = cs.Active,
        CreatedAt = cs.CreatedAt,
        UpdatedAt = cs.UpdatedAt
    };
}
