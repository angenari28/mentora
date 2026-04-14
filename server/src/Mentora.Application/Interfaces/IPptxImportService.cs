using Mentora.Application.DTOs;

namespace Mentora.Application.Interfaces;

public interface IPptxImportService
{
    Task<IEnumerable<CourseSlideResponse>> ImportFromPptxAsync(
        Stream fileStream,
        Guid courseId,
        Guid slideTypeId,
        string uploadsBasePath);
}
