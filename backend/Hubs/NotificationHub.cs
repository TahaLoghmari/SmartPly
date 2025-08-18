using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    // Hub methods = exposed RPC endpoints clients can call. Not needed unless you need the client to push notifications to the server.
    public async Task SendNotification(string message)
    {
        await Clients.All.SendAsync("ReceiveNotification", message);
    }
}