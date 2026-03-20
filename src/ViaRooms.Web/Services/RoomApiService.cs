using System.Net.Http.Json;
using ViaRooms.Shared.Models;

namespace ViaRooms.Web.Services;

public class RoomApiService(HttpClient http)
{
    public Task<List<StudyRoom>?> GetAllRoomsAsync() =>
        http.GetFromJsonAsync<List<StudyRoom>>("api/rooms");
}
