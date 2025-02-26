using Imenik.Entities;
using Microsoft.EntityFrameworkCore;
using MinimalApis.Extensions.Results;

namespace Imenik.Data;

public class ImenikContext(DbContextOptions<ImenikContext> options) : DbContext(options)
{
    public DbSet<Osoba> Osoba => Set<Osoba>();
    public DbSet<Drzava> Drzava => Set<Drzava>();
    public DbSet<Grad> Grad => Set<Grad>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Osoba>()
                .HasOne(o => o.Drzava)
                .WithMany()
                .HasForeignKey(o => o.DrzavaId)
                .OnDelete(DeleteBehavior.NoAction);  
        
        modelBuilder.Entity<Osoba>()
                .HasOne(o => o.Grad)
                .WithMany()
                .HasForeignKey(o => o.GradId)
                .OnDelete(DeleteBehavior.NoAction);  
    }
}
