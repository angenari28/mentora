using Microsoft.AspNetCore.Mvc;
using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;

namespace Mentora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CourseSlideController(
    ICourseSlideService _courseSlideService,
    IPptxImportService _pptxImportService,
    IWebHostEnvironment _env) : ControllerBase
{
    [HttpGet("course/{courseId:guid}")]
    public async Task<ActionResult> GetByCourse(Guid courseId)
    {
        try
        {
            var slides = await _courseSlideService.GetByCourseIdAsync(courseId);
            return Ok(new { success = true, message = "Slides recuperados com sucesso", data = slides });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar slides", error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        try
        {
            var slide = await _courseSlideService.GetByIdAsync(id);
            if (slide is null)
                return NotFound(new { success = false, message = "Slide não encontrado" });

            return Ok(new { success = true, message = "Slide recuperado com sucesso", data = slide });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar slide", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CourseSlideRequest request)
    {
        try
        {
            var created = await _courseSlideService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                new { success = true, message = "Slide criado com sucesso", data = created });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao criar slide", error = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] CourseSlideRequest request)
    {
        try
        {
            var updated = await _courseSlideService.UpdateAsync(id, request);
            if (updated is null)
                return NotFound(new { success = false, message = "Slide não encontrado" });

            return Ok(new { success = true, message = "Slide atualizado com sucesso", data = updated });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao atualizar slide", error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            var deleted = await _courseSlideService.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { success = false, message = "Slide não encontrado" });

            return Ok(new { success = true, message = "Slide removido com sucesso" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao remover slide", error = ex.Message });
        }
    }

    [HttpPut("reorder")]
    public async Task<ActionResult> Reorder([FromBody] CourseSlideReorderRequest request)
    {
        try
        {
            await _courseSlideService.ReorderAsync(request);
            return Ok(new { success = true, message = "Sequência atualizada com sucesso" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao reordenar slides", error = ex.Message });
        }
    }

    [HttpPost("import-pptx")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult> ImportFromPptx(
        [FromForm] Guid courseId,
        [FromForm] Guid slideTypeId,
        IFormFile file)
    {
        try
        {
            if (file is null || file.Length == 0)
                return BadRequest(new { success = false, message = "Arquivo não fornecido" });

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (ext != ".ppt" && ext != ".pptx")
                return BadRequest(new { success = false, message = "Apenas arquivos .ppt e .pptx são suportados" });

            var uploadsPath = Path.Combine(_env.ContentRootPath, "wwwroot");
            Directory.CreateDirectory(uploadsPath);

            using var stream = file.OpenReadStream();
            var slides = await _pptxImportService.ImportFromPptxAsync(stream, courseId, slideTypeId, uploadsPath);

            return Ok(new { success = true, message = $"{slides.Count()} slides importados com sucesso", data = slides });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao importar apresentação", error = ex.Message });
        }
    }
}
