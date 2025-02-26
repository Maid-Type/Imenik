using Imenik.Dtos;
using System.ComponentModel.DataAnnotations;

public class DrzavaDto
{
    public int Id { get; set; }

    [Required]
    public string Naziv { get; set; }

    public List<GradDto> Gradovi { get; set; } = new List<GradDto>();
}
