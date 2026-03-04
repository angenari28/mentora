using Microsoft.AspNetCore.Mvc;
using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;

namespace Mentora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassController(IClassService _classService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] PaginationParams pagination)
    {
        try
        {
            var classes = await _classService.GetPagedAsync(pagination);
            return Ok(new { success = true, message = "Turmas recuperadas com sucesso", data = classes });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar turmas", error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        try
        {
            var @class = await _classService.GetByIdAsync(id);
            if (@class is null)
                return NotFound(new { success = false, message = "Turma não encontrada" });

            return Ok(new { success = true, message = "Turma recuperada com sucesso", data = @class });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar turma", error = ex.Message });
        }
    }

    [HttpGet("workspace/{workspaceId:guid}")]
    public async Task<ActionResult> GetByWorkspace(Guid workspaceId)
    {
        try
        {
            var classes = await _classService.GetByWorkspaceIdAsync(workspaceId);
            return Ok(new { success = true, message = "Turmas recuperadas com sucesso", data = classes });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar turmas", error = ex.Message });
        }
    }

    [HttpGet("course/{courseId:guid}")]
    public async Task<ActionResult> GetByCourse(Guid courseId)
    {
        try
        {
            var classes = await _classService.GetByCourseIdAsync(courseId);
            return Ok(new { success = true, message = "Turmas recuperadas com sucesso", data = classes });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar turmas", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] ClassRequest request)
    {
        try
        {
            var created = await _classService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                new { success = true, message = "Turma criada com sucesso", data = created });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao criar turma", error = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] ClassRequest request)
    {
        try
        {
            var updated = await _classService.UpdateAsync(id, request);
            if (updated is null)
                return NotFound(new { success = false, message = "Turma não encontrada" });

            return Ok(new { success = true, message = "Turma atualizada com sucesso", data = updated });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao atualizar turma", error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            var deleted = await _classService.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { success = false, message = "Turma não encontrada" });

            return Ok(new { success = true, message = "Turma excluída com sucesso" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao excluir turma", error = ex.Message });
        }
    }
}
