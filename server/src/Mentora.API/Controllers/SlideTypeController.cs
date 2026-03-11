using Microsoft.AspNetCore.Mvc;
using Mentora.Application.Interfaces;

namespace Mentora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SlideTypeController(ISlideTypeService _slideTypeService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        try
        {
            var slideTypes = await _slideTypeService.GetAllAsync();
            return Ok(new { success = true, message = "Tipos de slide recuperados com sucesso", data = slideTypes });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar tipos de slide", error = ex.Message });
        }
    }
}
