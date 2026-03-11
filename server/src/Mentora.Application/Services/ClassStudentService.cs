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
