using System.Text.Json.Serialization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ViaRooms.Api.Components;
using ViaRooms.Api.Data;
using ViaRooms.Api.Data.Seed;
using ViaRooms.Api.Hubs;
using ViaRooms.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<RoomService>();
builder.Services.AddHostedService<SensorSimulatorService>();
builder.Services.AddSignalR();
builder.Services.ConfigureHttpJsonOptions(opt =>
    opt.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddRazorComponents().AddInteractiveServerComponents();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
    await DatabaseSeeder.SeedAsync(scope.ServiceProvider);

app.UseStaticFiles();
app.UseAntiforgery();

app.MapHub<RoomHub>("/roomhub");

app.MapRazorComponents<App>().AddInteractiveServerRenderMode();

// REST API endpoints
app.MapGet("/api/rooms", async (RoomService svc) =>
    Results.Ok(await svc.GetAllRoomsAsync()));

app.MapGet("/api/rooms/{roomId}", async (string roomId, RoomService svc) =>
{
    var room = await svc.GetRoomAsync(roomId);
    return room is null ? Results.NotFound() : Results.Ok(room);
});

app.MapPost("/api/sensor/{sensorId}", async (
    string sensorId,
    RoomService svc,
    IHubContext<RoomHub> hubContext) =>
{
    var room = await svc.HandleSensorEventAsync(sensorId);
    if (room is null) return Results.NotFound();
    await hubContext.Clients.All.SendAsync("RoomUpdated");
    return Results.Ok(room);
});

app.Run();
