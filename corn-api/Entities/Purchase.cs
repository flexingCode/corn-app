using System.ComponentModel.DataAnnotations;

namespace corn_api.Entities;

public class Purchase
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}