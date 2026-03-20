using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ViaRooms.Api.Data;
using ViaRooms.Api.Hubs;
using ViaRooms.Api.Models;

namespace ViaRooms.Api.Services;

public class SensorSimulatorService(
    IServiceScopeFactory scopeFactory,
    IHubContext<RoomHub> hubContext,
    IConfiguration config,
    ILogger<SensorSimulatorService> logger) : BackgroundService
{
    private readonly int _tickMs = config.GetValue("Simulator:TickIntervalSeconds", 8) * 1000;
    private readonly int _thresholdMin = config.GetValue("Simulator:AvailabilityThresholdMinutes", 5);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("[Simulator] Started. Tick={Tick}s, Threshold={Threshold}min", _tickMs / 1000, _thresholdMin);

        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(_tickMs, stoppingToken);
            await TickAsync();
        }
    }

    private async Task TickAsync()
    {
        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var allIds = await db.StudyRooms.Select(r => r.Id).ToListAsync();
        if (allIds.Count == 0) return;

        var rng = new Random();
        var count = rng.Next(1, 4);
        var pickedIds = allIds.OrderBy(_ => rng.Next()).Take(count).ToList();

        var rooms = await db.StudyRooms.Where(r => pickedIds.Contains(r.Id)).ToListAsync();
        var threshold = DateTime.UtcNow.AddMinutes(-_thresholdMin);

        foreach (var room in rooms)
        {
            if (room.Status == RoomStatus.Occupied && room.LastActivityTime < threshold)
            {
                room.Status = RoomStatus.Available;
                logger.LogInformation("[Simulator] {RoomId} → Available (inactive)", room.RoomId);
            }
            else
            {
                room.Status = RoomStatus.Occupied;
                room.LastActivityTime = DateTime.UtcNow;
                logger.LogInformation("[Simulator] {RoomId} → Occupied", room.RoomId);
            }
        }

        await db.SaveChangesAsync();
        await hubContext.Clients.All.SendAsync("RoomUpdated");
    }
}
