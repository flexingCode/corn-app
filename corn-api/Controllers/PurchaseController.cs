using AutoMapper;
using corn_api.Data;
using corn_api.DTO;
using corn_api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace corn_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PurchaseController(ApplicationDbContext dbContext, IMapper mapper) : ControllerBase
{
    private readonly ApplicationDbContext _context = dbContext;
    private readonly IMapper _mapper = mapper;

    [HttpPost]
    public async Task<ActionResult<PurchaseResponseDTO>> Post(PurchaseDTO purchaseDTO)
    {
        
        var purchase = _mapper.Map<Purchase>(purchaseDTO);
        var lastPurchaseByEmail = await _context.Purchases.Where(p => p.Email == purchase.Email).OrderByDescending(p => p.CreatedAt).FirstOrDefaultAsync();
        if (lastPurchaseByEmail == null)
        {
            _context.Purchases.Add(purchase);
            var result = await _context.SaveChangesAsync();
            return Ok(new PurchaseResponseDTO
            {
                LastPurchase = (await GetLastPurchaseByEmail(purchase.Email)).LastPurchase!
            });
        }
        var currentDate = DateTime.UtcNow;
        var lastPurchaseDate = lastPurchaseByEmail.CreatedAt;
        var diffInMinutes = (currentDate - lastPurchaseDate).TotalMinutes;
        if (diffInMinutes < 1)
        {
            return StatusCode(429, new 
            { 
                message = "Too many requests. Please wait before making another purchase.",
                lastPurchase = lastPurchaseDate,
                timeRemaining = 60 - (int)diffInMinutes
            });
        }

        _context.Purchases.Add(purchase);
        await _context.SaveChangesAsync();
        return Ok(new PurchaseResponseDTO { LastPurchase = lastPurchaseDate });
    }

    private async Task<PurchaseResponseDTO> GetLastPurchaseByEmail(string email)
    {
        var lastPurchaseByEmail = await _context.Purchases.Where(p => p.Email == email).OrderByDescending(p => p.CreatedAt).FirstOrDefaultAsync();
        return _mapper.Map<PurchaseResponseDTO>(lastPurchaseByEmail);
    }
}