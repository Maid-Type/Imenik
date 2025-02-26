using Imenik.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Imenik.Controllers;

[ApiController]
[Route("gradovi")]
public class GradoviController : ControllerBase
{
    private readonly ImenikContext _dbContext;

    public GradoviController(ImenikContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: gradovi/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetByDrzavaId(int id)
    {
        var gradovi = await _dbContext.Grad
            .Include(grad => grad.Drzava)
            .Where(grad => grad.DrzavaId == id)
            .Select(grad => new
            {
                Id = grad.Id,
                Naziv = grad.Naziv,
                DrzavaId = grad.DrzavaId,
                Drzava = grad.Drzava.Naziv
            })
            .ToListAsync();

        return Ok(gradovi);
    }
}