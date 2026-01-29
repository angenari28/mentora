using Microsoft.AspNetCore.Mvc;

namespace Mentora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckController : ControllerBase
{
    [HttpGet]
    public ActionResult Check()
    {
        return Ok(new { Message = "API is running." });
    }
}