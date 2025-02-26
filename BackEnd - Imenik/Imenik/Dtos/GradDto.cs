using System.ComponentModel.DataAnnotations;

namespace Imenik.Dtos;

public class GradDto
{
    public int Id { get; set; }

    [Required]
    public string Naziv { get; set; }
}
