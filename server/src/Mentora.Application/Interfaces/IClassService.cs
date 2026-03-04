using Mentora.Application.DTOs;
using Mentora.Domain.Common;

namespace Mentora.Application.Interfaces;

public interface IClassService
{
    Task<PagedResult<ClassResponse>> GetPagedAsync(PaginationParams pagination);
    Task<ClassResponse?> GetByIdAsync(Guid id);
    Task<IEnumerable<ClassResponse>> GetByWorkspaceIdAsync(Guid workspaceId);
    Task<IEnumerable<ClassResponse>> GetByCourseIdAsync(Guid courseId);
    Task<ClassResponse> CreateAsync(ClassRequest request);
    Task<ClassResponse?> UpdateAsync(Guid id, ClassRequest request);
    Task<bool> DeleteAsync(Guid id);
}
