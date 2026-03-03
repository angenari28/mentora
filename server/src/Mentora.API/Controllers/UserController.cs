using Microsoft.AspNetCore.Mvc;
using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;

namespace Mentora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService _userService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] PaginationParams pagination)
    {
        try
        {
            var users = await _userService.GetPagedResult(pagination);
            return Ok(new { success = true, message = "Usuários recuperados com sucesso", data = users });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar usuários", error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user is null)
                return NotFound(new { success = false, message = "Usuário não encontrado" });

            return Ok(new { success = true, message = "Usuário recuperado com sucesso", data = user });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar usuário", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] UserRequest request)
    {
        try
        {
            var created = await _userService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                new { success = true, message = "Usuário criado com sucesso", data = created });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao criar usuário", error = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UserRequest request)
    {
        try
        {
            var updated = await _userService.UpdateAsync(id, request);
            if (updated is null)
                return NotFound(new { success = false, message = "Usuário não encontrado" });

            return Ok(new { success = true, message = "Usuário atualizado com sucesso", data = updated });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao atualizar usuário", error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            var deleted = await _userService.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { success = false, message = "Usuário não encontrado" });

            return Ok(new { success = true, message = "Usuário excluído com sucesso" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao excluir usuário", error = ex.Message });
        }
    }
}


