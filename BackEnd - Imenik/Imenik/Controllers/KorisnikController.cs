using Imenik.Data;
using Imenik.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Imenik.Controllers;

[ApiController]
[Route("korisnici")]
public class KorisnikController : ControllerBase
{
    private readonly ImenikContext _dbContext;

    public KorisnikController(ImenikContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: korisnici
    [HttpGet]
    [Route("")]
    public async Task<IActionResult> GetAll()
    {
        var korisnici = await _dbContext.Osoba
            .Include(o => o.Drzava)
            .Include(o => o.Grad)
            .Select(o => new
            {
                Id = o.Id,
                Ime = o.Ime,
                Prezime = o.Prezime,
                BrojTelefona = o.BrojTelefona,
                Pol = o.Pol,
                Email = o.Email,
                DrzavaId = o.DrzavaId,
                Drzava = o.Drzava.Naziv,
                GradId = o.GradId,
                Grad = o.Grad.Naziv,
                DatumRodjenja = o.DatumRodjenja,
                Starost = o.Starost
            })
            .ToListAsync();

        return Ok(korisnici);
    }

    // GET: korisnici/{id}
    [HttpGet("{id:int}", Name = "GetKorisnik")]
    public async Task<IActionResult> GetById(int id)
    {
        var osoba = await _dbContext.Osoba
            .Include(o => o.Drzava)
            .Include(o => o.Grad)
            .Select(o => new
            {
                Id = o.Id,
                Ime = o.Ime,
                Prezime = o.Prezime,
                BrojTelefona = o.BrojTelefona,
                Pol = o.Pol,
                Email = o.Email,
                DrzavaId = o.DrzavaId,
                Drzava = o.Drzava.Naziv,
                GradId = o.GradId,
                Grad = o.Grad.Naziv,
                DatumRodjenja = o.DatumRodjenja,
                Starost = o.Starost
            })
            .FirstOrDefaultAsync(o => o.Id == id);

        return osoba is null ? NotFound() : Ok(osoba);
    }

    // POST: korisnici
    [HttpPost]
    public async Task<IActionResult> Create(Osoba novaOsoba)
    {
        var drzavaNaziv = await _dbContext.Drzava
            .Where(d => d.Id == novaOsoba.DrzavaId)
            .Select(d => d.Naziv)
            .FirstOrDefaultAsync();

        var gradNaziv = await _dbContext.Grad
            .Where(g => g.Id == novaOsoba.GradId)
            .Select(g => g.Naziv)
            .FirstOrDefaultAsync();

        if (drzavaNaziv == null || gradNaziv == null)
        {
            return BadRequest(new { message = "Invalid DrzavaId or GradId." });
        }

        Osoba osoba = new Osoba
        {
            Ime = novaOsoba.Ime,
            Prezime = novaOsoba.Prezime,
            BrojTelefona = novaOsoba.BrojTelefona,
            Pol = novaOsoba.Pol,
            Email = novaOsoba.Email,
            DrzavaId = novaOsoba.DrzavaId,
            GradId = novaOsoba.GradId,
            DatumRodjenja = novaOsoba.DatumRodjenja,
            Starost = novaOsoba.Starost
        };

        _dbContext.Add(osoba);
        await _dbContext.SaveChangesAsync();

        var response = new
        {
            osoba.Id,
            osoba.Ime,
            osoba.Prezime,
            osoba.BrojTelefona,
            osoba.Pol,
            osoba.Email,
            Drzava = drzavaNaziv,
            Grad = gradNaziv,
            osoba.DatumRodjenja,
            osoba.Starost
        };

        return Ok(response);
    }


    // PUT: korisnici/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, OsobaDto azuriranaOsoba)
    {
        var osoba = await _dbContext.Osoba.FindAsync(id);
        if (osoba is null) return NotFound();

        _dbContext.Entry(osoba).CurrentValues.SetValues(azuriranaOsoba);
        await _dbContext.SaveChangesAsync();

        return CreatedAtRoute("GetKorisnik", new { id = id }, azuriranaOsoba);
    }

    // DELETE: korisnici/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var osoba = await _dbContext.Osoba.FindAsync(id);
        if (osoba is null) return NotFound();

        _dbContext.Remove(osoba);
        await _dbContext.SaveChangesAsync();

        return await GetAll();
    }
}