using Microsoft.AspNetCore.Mvc;
using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;

namespace Mentora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkspaceController(IWorkspaceService _workspaceService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] PaginationParams pagination)
    {
        try
        {
            var workspaces = await _workspaceService.GetPagedResultAsync(pagination);
            return Ok(new { success = true, message = "Workspaces recuperados com sucesso", data = workspaces });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar workspaces", error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        try
        {
            var workspace = await _workspaceService.GetWorkspaceByIdAsync(id);
            if (workspace is null)
                return NotFound(new { success = false, message = "Workspace não encontrado" });

            return Ok(new { success = true, message = "Workspace recuperado com sucesso", data = workspace });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar workspace", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] WorkspaceRequest request)
    {
        try
        {
            var created = await _workspaceService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                new { success = true, message = "Workspace criado com sucesso", data = created });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao criar workspace", error = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] WorkspaceRequest request)
    {
        try
        {
            var updated = await _workspaceService.UpdateAsync(id, request);
            if (updated is null)
                return NotFound(new { success = false, message = "Workspace não encontrado" });

            return Ok(new { success = true, message = "Workspace atualizado com sucesso", data = updated });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao atualizar workspace", error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            var deleted = await _workspaceService.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { success = false, message = "Workspace não encontrado" });

            return Ok(new { success = true, message = "Workspace deletado com sucesso" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao deletar workspace", error = ex.Message });
        }
    }
}
