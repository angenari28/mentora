using Microsoft.AspNetCore.Mvc;
using Mentora.Application.Interfaces;

namespace Mentora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService _userService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        try
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(new
            {
                success = true,
                message = "Usuários recuperados com sucesso",
                data = users
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Erro ao recuperar usuários",
                error = ex.Message
            });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Usuário não encontrado"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Usuário recuperado com sucesso",
                data = user
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Erro ao recuperar usuário",
                error = ex.Message
            });
        }
    }
}

