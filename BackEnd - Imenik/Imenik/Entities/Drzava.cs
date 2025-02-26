using System.ComponentModel.DataAnnotations;

namespace Imenik.Entities;
public class Drzava
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public required string Naziv { get; set; }

    public List<Grad> Gradovi { get; set; } = new List<Grad>();
}
