namespace ViaRooms.Api.Models;

public class Hub
{
    public string HubId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public ICollection<StudyRoom> StudyRooms { get; set; } = new List<StudyRoom>();
}
