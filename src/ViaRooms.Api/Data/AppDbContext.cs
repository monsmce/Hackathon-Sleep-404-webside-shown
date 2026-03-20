using Microsoft.EntityFrameworkCore;
// SQLite-backed context — no Npgsql dependency
using ViaRooms.Shared.Models;

namespace ViaRooms.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Hub> Hubs => Set<Hub>();
    public DbSet<StudyRoom> StudyRooms => Set<StudyRoom>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Hub>().HasKey(h => h.HubId);
        modelBuilder.Entity<StudyRoom>().HasKey(r => r.Id); 
        modelBuilder.Entity<StudyRoom>()
            .HasOne(r => r.Hub)
            .WithMany(h => h.StudyRooms)
            .HasForeignKey(r => r.HubId);
    }
}
