using Mentora.Domain.Common;
using Mentora.Domain.Entities;

namespace Mentora.Domain.Interfaces;

public interface IClassStudentRepository : IPagedRepository<ClassStudent>
{
    Task<ClassStudent?> GetByIdAsync(Guid id);
    Task<IEnumerable<ClassStudent>> GetByClassIdAsync(Guid classId);
    Task<IEnumerable<ClassStudent>> GetByUserIdAsync(Guid userId);
    Task<ClassStudent> CreateAsync(ClassStudent classStudent);
    Task<bool> DeleteAsync(Guid id);
}
