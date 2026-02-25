using Microsoft.AspNetCore.Mvc;
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
            return Ok(new
            {
                success = true,
                message = "Workspaces recuperados com sucesso",
                data = workspaces
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Erro ao recuperar workspaces",
                error = ex.Message
            });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        try
        {
            var workspace = await _workspaceService.GetWorkspaceByIdAsync(id);
            if (workspace == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Workspace não encontrado"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Workspace recuperado com sucesso",
                data = workspace
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Erro ao recuperar workspace",
                error = ex.Message
            });
        }
    }
}
