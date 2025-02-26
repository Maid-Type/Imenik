using System.ComponentModel.DataAnnotations;

namespace Imenik.Entities;

public class Osoba
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Ime { get; set; }

    [Required]
    [StringLength(50)]
    public string Prezime { get; set; }

    [Required]
    [RegularExpression(@"^\d{3}/\d{3}-\d{3}$")]
    public string BrojTelefona { get; set; }

    [Required]
    public string Pol { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public int DrzavaId { get; set; }

    public Drzava? Drzava { get; set; }

    [Required]
    public int GradId { get; set; }

    public Grad? Grad { get; set; } 

    [Required]
    [DataType(DataType.Date)]
    public DateTime DatumRodjenja { get; set; }

    [Required]
    public int Starost { get; set; }
}
