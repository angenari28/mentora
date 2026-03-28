using Microsoft.AspNetCore.Mvc;
using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;

namespace Mentora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CourseSlideTimeController(ICourseSlideTimeService _courseSlideTimeService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CourseSlideTimeCreateRequest request)
    {
        try
        {
            var created = await _courseSlideTimeService.CreateAsync(request);
            return Ok(new { success = true, message = "Registro de tempo criado com sucesso", data = created });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao criar registro de tempo", error = ex.Message });
        }
    }

    [HttpPatch("{id:guid}/end")]
    public async Task<ActionResult> End(Guid id, [FromBody] CourseSlideTimeEndRequest request)
    {
        try
        {
            var updated = await _courseSlideTimeService.EndAsync(id, request);
            if (updated is null)
                return NotFound(new { success = false, message = "Registro de tempo não encontrado" });

            return Ok(new { success = true, message = "Registro de tempo encerrado com sucesso", data = updated });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao encerrar registro de tempo", error = ex.Message });
        }
    }

    [HttpDelete("reset/user/{userId:guid}/course/{courseId:guid}")]
    public async Task<ActionResult> Reset(Guid userId, Guid courseId)
    {
        try
        {
            var deleted = await _courseSlideTimeService.ResetByCourseAndUserAsync(userId, courseId);
            return Ok(new { success = true, message = $"{deleted} registro(s) de tempo removido(s) com sucesso", data = deleted });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao reiniciar progresso do aluno", error = ex.Message });
        }
    }
}
