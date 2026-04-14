using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Entities;
using Mentora.Domain.Interfaces;
using PDFtoImage;
using System.Diagnostics;

namespace Mentora.Application.Services;

public class PptxImportService(ICourseSlideRepository _repository) : IPptxImportService
{
    public async Task<IEnumerable<CourseSlideResponse>> ImportFromPptxAsync(
        Stream fileStream,
        Guid courseId,
        Guid slideTypeId,
        string uploadsBasePath)
    {
        var courseFolder = Path.Combine(uploadsBasePath, "uploads", "slides", courseId.ToString());
        Directory.CreateDirectory(courseFolder);

        var tempDir = Path.Combine(Path.GetTempPath(), Guid.CreateVersion7().ToString());
        Directory.CreateDirectory(tempDir);
        var tempFile = Path.Combine(tempDir, "presentation.pptx");

        try
        {
            await using (var fs = File.Create(tempFile))
                await fileStream.CopyToAsync(fs);

            // Etapa 1: PPTX → PDF via LibreOffice
            await ConvertToPdfAsync(tempFile, tempDir);

            var pdfPath = Path.Combine(tempDir, "presentation.pdf");
            if (!File.Exists(pdfPath))
                throw new InvalidOperationException(
                    "LibreOffice não gerou o PDF. Verifique se o LibreOffice está instalado.");

            // Etapa 2: PDF → PNG por página via PDFtoImage
            var pdfBytes = await File.ReadAllBytesAsync(pdfPath);
#pragma warning disable CA1416 // Suportado em Windows, Linux e macOS (mesmas plataformas que o LibreOffice)
            int pageCount = Conversion.GetPageCount(pdfBytes);

            if (pageCount == 0)
                throw new InvalidOperationException("A apresentação não contém páginas.");

            var results = new List<CourseSlideResponse>();
            var options = new RenderOptions(Dpi: 150);

            for (int i = 0; i < pageCount; i++)
            {
                var imageFileName = $"{Guid.CreateVersion7()}.png";
                var imagePath = Path.Combine(courseFolder, imageFileName);

                await using (var imgStream = File.Create(imagePath))
                    Conversion.SavePng(imgStream, pdfBytes, page: Index.FromStart(i), options: options);
#pragma warning restore CA1416

                var entity = new CourseSlide
                {
                    Id = Guid.CreateVersion7(),
                    CourseId = courseId,
                    SlideTypeId = slideTypeId,
                    Title = $"Slide {i + 1}",
                    Content = $"/uploads/slides/{courseId}/{imageFileName}",
                    Ordering = i + 1,
                    Active = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var created = await _repository.CreateAsync(entity);
                results.Add(ToResponse(created));
            }

            return results;
        }
        finally
        {
            if (Directory.Exists(tempDir))
                Directory.Delete(tempDir, recursive: true);
        }
    }

    private static async Task ConvertToPdfAsync(string inputFile, string outputDir)
    {
        var psi = new ProcessStartInfo
        {
            FileName = GetSOfficeExecutable(),
            Arguments = $"--headless --convert-to pdf --outdir \"{outputDir}\" \"{inputFile}\"",
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        using var process = Process.Start(psi)
            ?? throw new InvalidOperationException("Não foi possível iniciar o LibreOffice.");

        await process.WaitForExitAsync();

        if (process.ExitCode != 0)
        {
            var stderr = await process.StandardError.ReadToEndAsync();
            throw new InvalidOperationException($"LibreOffice retornou erro (código {process.ExitCode}): {stderr}");
        }
    }

    private static string GetSOfficeExecutable()
    {
        if (!OperatingSystem.IsWindows())
            return "soffice";

        string[] candidates =
        [
            @"C:\Program Files\LibreOffice\program\soffice.exe",
            @"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
        ];

        foreach (var path in candidates)
        {
            if (File.Exists(path))
                return path;
        }

        return "soffice.exe";
    }

    private static CourseSlideResponse ToResponse(CourseSlide s) => new()
    {
        Id = s.Id,
        CourseId = s.CourseId,
        CourseName = string.Empty,
        SlideTypeId = s.SlideTypeId,
        SlideTypeName = string.Empty,
        Title = s.Title,
        Content = s.Content,
        Ordering = s.Ordering,
        Active = s.Active,
        CreatedAt = s.CreatedAt,
        UpdatedAt = s.UpdatedAt
    };
}
