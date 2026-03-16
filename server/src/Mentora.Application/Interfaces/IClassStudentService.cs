using Mentora.Application.DTOs;
using Mentora.Domain.Common;

namespace Mentora.Application.Interfaces;

public interface IClassStudentService
{
    Task<PagedResult<ClassStudentResponse>> GetPagedAsync(PaginationParams pagination);
    Task<ClassStudentResponse?> GetByIdAsync(Guid id);
    Task<IEnumerable<StudentClassesResponse>> GetClassesByStudentIdAsync(Guid userId);
    Task<ClassStudentResponse> CreateAsync(ClassStudentRequest request);
    Task<bool> DeleteAsync(Guid id);
}
