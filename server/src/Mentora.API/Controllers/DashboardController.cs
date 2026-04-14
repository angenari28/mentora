using Microsoft.AspNetCore.Mvc;
using Mentora.Application.Interfaces;

namespace Mentora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(IDashboardService _dashboardService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> Get([FromQuery] Guid workspaceId, CancellationToken cancellationToken)
    {
        if (workspaceId == Guid.Empty)
            return BadRequest(new { success = false, message = "workspaceId é obrigatório." });

        try
        {
            var result = await _dashboardService.GetDashboardAsync(workspaceId, cancellationToken);
            return Ok(new { success = true, message = "Dashboard recuperado com sucesso.", data = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar dados do dashboard.", error = ex.Message });
        }
    }
}
