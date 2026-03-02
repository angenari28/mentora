using Microsoft.AspNetCore.Mvc;
using Mentora.Application.DTOs;
using Mentora.Application.Interfaces;
using Mentora.Domain.Common;

namespace Mentora.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController(ICategoryService _categoryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] PaginationParams pagination)
    {
        try
        {
            var categories = await _categoryService.GetPagedAsync(pagination);
            return Ok(new { success = true, message = "Categorias recuperadas com sucesso", data = categories });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar categorias", error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        try
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category is null)
                return NotFound(new { success = false, message = "Categoria não encontrada" });

            return Ok(new { success = true, message = "Categoria recuperada com sucesso", data = category });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar categoria", error = ex.Message });
        }
    }

    [HttpGet("workspace/{workspaceId:guid}")]
    public async Task<ActionResult> GetByWorkspace(Guid workspaceId)
    {
        try
        {
            var categories = await _categoryService.GetByWorkspaceIdAsync(workspaceId);
            return Ok(new { success = true, message = "Categorias recuperadas com sucesso", data = categories });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao recuperar categorias", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CategoryRequest request)
    {
        try
        {
            var created = await _categoryService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                new { success = true, message = "Categoria criada com sucesso", data = created });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao criar categoria", error = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] CategoryRequest request)
    {
        try
        {
            var updated = await _categoryService.UpdateAsync(id, request);
            if (updated is null)
                return NotFound(new { success = false, message = "Categoria não encontrada" });

            return Ok(new { success = true, message = "Categoria atualizada com sucesso", data = updated });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro ao atualizar categoria", error = ex.Message });
        }
    }
}
