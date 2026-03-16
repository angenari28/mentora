using Microsoft.AspNetCore.Mvc;
using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;

namespace Mentora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CourseController(ICourseService _courseService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] PaginationParams pagination)
    {
        try
        {
            var courses = await _courseService.GetPagedAsync(pagination);
            return Ok(new { success = true, message = "Cursos recuperados com sucesso", data = courses });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar cursos", error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        try
        {
            var course = await _courseService.GetByIdAsync(id);
            if (course is null)
                return NotFound(new { success = false, message = "Curso não encontrado" });

            return Ok(new { success = true, message = "Curso recuperado com sucesso", data = course });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar curso", error = ex.Message });
        }
    }

    [HttpGet("category/{categoryId:guid}")]
    public async Task<ActionResult> GetByCategory(Guid categoryId)
    {
        try
        {
            var courses = await _courseService.GetByCategoryIdAsync(categoryId);
            return Ok(new { success = true, message = "Cursos recuperados com sucesso", data = courses });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar cursos", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CourseRequest request)
    {
        try
        {
            var created = await _courseService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                new { success = true, message = "Curso criado com sucesso", data = created });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao criar curso", error = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] CourseRequest request)
    {
        try
        {
            var updated = await _courseService.UpdateAsync(id, request);
            if (updated is null)
                return NotFound(new { success = false, message = "Curso não encontrado" });

            return Ok(new { success = true, message = "Curso atualizado com sucesso", data = updated });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao atualizar curso", error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            var deleted = await _courseService.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { success = false, message = "Curso não encontrado" });

            return Ok(new { success = true, message = "Curso excluído com sucesso" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao excluir curso", error = ex.Message });
        }
    }
}
