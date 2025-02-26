using Imenik.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Imenik.Controllers;

[ApiController]
[Route("drzave")]
public class DrzaveController : ControllerBase
{
    private readonly ImenikContext _dbContext;

    public DrzaveController(ImenikContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var drzave = await _dbContext.Drzava
            .Select(o => new DrzavaDto
            {
                Id = o.Id,
                Naziv = o.Naziv
            })
            .ToListAsync();

        return Ok(drzave);
    }
}