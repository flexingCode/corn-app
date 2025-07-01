using corn_api.Entities;
using Microsoft.EntityFrameworkCore;

namespace corn_api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Purchase> Purchases { get; set; }
}