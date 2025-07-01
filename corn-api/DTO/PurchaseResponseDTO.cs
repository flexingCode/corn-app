namespace corn_api.DTO;

public class PurchaseResponseDTO
{
    public DateTime LastPurchase { get; set; } = DateTime.UtcNow;
}