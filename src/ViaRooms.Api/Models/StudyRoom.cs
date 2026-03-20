namespace ViaRooms.Api.Models;

public enum RoomStatus { Available, Occupied }

public class StudyRoom
{
    public int Id { get; set; }
    public string RoomId { get; set; } = string.Empty;
    public string HubId { get; set; } = string.Empty;
    public Hub Hub { get; set; } = null!;
    public int FloorNumber { get; set; }
    public int? Capacity { get; set; }
    public RoomStatus Status { get; set; }
    public DateTime LastActivityTime { get; set; }
    public string? SensorId { get; set; }
}
