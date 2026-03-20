using Microsoft.EntityFrameworkCore;
using ViaRooms.Api.Models;

namespace ViaRooms.Api.Data.Seed;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var context = services.GetRequiredService<AppDbContext>();
        await context.Database.EnsureCreatedAsync();

        if (await context.Hubs.AnyAsync()) return;

        var rng = new Random();

        var hubs = new List<Hub>
        {
            new() { HubId = "A", Name = "Hub A" },
            new() { HubId = "B", Name = "Hub B" },
            new() { HubId = "C", Name = "Hub C" },
        };
        context.Hubs.AddRange(hubs);

        var rooms = new List<StudyRoom>();
        var hubFloors = new Dictionary<string, int[]>
        {
            ["A"] = [2, 3, 4, 5],
            ["B"] = [2, 3, 4, 5],
            ["C"] = [2, 3, 4, 5, 6],
        };

        foreach (var (hubId, floors) in hubFloors)
        {
            foreach (var floor in floors)
            {
                for (var room = 1; room <= 12; room++)
                {
                    rooms.Add(new StudyRoom
                    {
                        RoomId = $"{hubId}.{floor}.{room:D2}",
                        HubId = hubId,
                        FloorNumber = floor,
                        Status = rng.Next(2) == 0 ? RoomStatus.Available : RoomStatus.Occupied,
                        LastActivityTime = DateTime.UtcNow.AddMinutes(-rng.Next(0, 30)),
                        SensorId = $"sensor-{hubId}-{floor}-{room:D2}",
                    });
                }
            }
        }

        context.StudyRooms.AddRange(rooms);
        await context.SaveChangesAsync();

        Console.WriteLine($"[Seeder] Seeded {hubs.Count} hubs and {rooms.Count} rooms.");
    }
}
