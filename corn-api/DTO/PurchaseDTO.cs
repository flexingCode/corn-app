using System.ComponentModel.DataAnnotations;

namespace corn_api.DTO;

public class PurchaseDTO
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}