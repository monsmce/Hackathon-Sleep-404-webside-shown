using Microsoft.EntityFrameworkCore;
using ViaRooms.Api.Data;
using ViaRooms.Api.Models;

namespace ViaRooms.Api.Services;

public class RoomService(AppDbContext db)
{
    public Task<List<StudyRoom>> GetAllRoomsAsync() =>
        db.StudyRooms.Include(r => r.Hub).OrderBy(r => r.HubId).ThenBy(r => r.FloorNumber).ThenBy(r => r.RoomId).ToListAsync();

    public Task<StudyRoom?> GetRoomAsync(string roomId) =>
        db.StudyRooms.Include(r => r.Hub).FirstOrDefaultAsync(r => r.RoomId == roomId);

    public async Task<StudyRoom?> HandleSensorEventAsync(string sensorId)
    {
        var room = await db.StudyRooms.FirstOrDefaultAsync(r => r.SensorId == sensorId);
        if (room is null) return null;

        room.Status = RoomStatus.Occupied;
        room.LastActivityTime = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return room;
    }
}
