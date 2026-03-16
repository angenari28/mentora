using Microsoft.AspNetCore.Mvc;
using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;

namespace Mentora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassStudentController(IClassStudentService _classStudentService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] PaginationParams pagination)
    {
        try
        {
            var result = await _classStudentService.GetPagedAsync(pagination);
            return Ok(new { success = true, message = "Matrículas recuperadas com sucesso", data = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar matrículas", error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        try
        {
            var result = await _classStudentService.GetByIdAsync(id);
            if (result is null)
                return NotFound(new { success = false, message = "Matrícula não encontrada" });

            return Ok(new { success = true, message = "Matrícula recuperada com sucesso", data = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar matrícula", error = ex.Message });
        }
    }

    [HttpGet("student/{userId:guid}")]
    public async Task<ActionResult> GetByStudent(Guid userId)
    {
        try
        {
            var result = await _classStudentService.GetClassesByStudentIdAsync(userId);
            return Ok(new { success = true, message = "Turmas do aluno recuperadas com sucesso", data = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar turmas do aluno", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] ClassStudentRequest request)
    {
        try
        {
            var created = await _classStudentService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                new { success = true, message = "Matrícula criada com sucesso", data = created });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao criar matrícula", error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            var deleted = await _classStudentService.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { success = false, message = "Matrícula não encontrada" });

            return Ok(new { success = true, message = "Matrícula excluída com sucesso" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao excluir matrícula", error = ex.Message });
        }
    }
}
