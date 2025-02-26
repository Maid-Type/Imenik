using System;
using System.ComponentModel.DataAnnotations;

public record class OsobaDto
{
    [Required]
    [StringLength(50, ErrorMessage = "Ime može imati maksimalno 50 karaktera.")]
    public string Ime { get; set; }

    [Required]
    [StringLength(50, ErrorMessage = "Prezime može imati maksimalno 50 karaktera.")]
    public string Prezime { get; set; }

    [Required]
    [RegularExpression(@"^\d{3}/\d{3}-\d{3}$", ErrorMessage = "Format telefona mora biti XXX/XXX-XXX.")]
    public string BrojTelefona { get; set; }

    [Required]
    public string Pol { get; set; }

    [Required]
    [EmailAddress(ErrorMessage = "Neispravan format email adrese.")]
    public string Email { get; set; }

    [Required]
    public int DrzavaId { get; set; } 

    [Required]
    public int GradId { get; set; } 

    [Required]
    [DataType(DataType.Date)]
    public DateTime DatumRodjenja { get; set; }

    [Required]
    public int Starost { get; set; }
}
