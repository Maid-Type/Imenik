using System.ComponentModel.DataAnnotations;

namespace Imenik.Entities
{
    public class Grad
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Naziv { get; set; } = string.Empty; 

        [Required]
        public int DrzavaId { get; set; }

        public Drzava? Drzava { get; set; }
    }
}
