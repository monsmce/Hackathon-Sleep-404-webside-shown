using ViaRooms.Web.Components;
using ViaRooms.Web.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<RoomApiService>(c =>
    c.BaseAddress = new Uri(builder.Configuration["ApiBaseUrl"]!));

builder.Services.AddRazorComponents().AddInteractiveServerComponents();

var app = builder.Build();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>().AddInteractiveServerRenderMode();

app.Run();
