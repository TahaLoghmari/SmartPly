using backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace backend.Services;

public class NotificationService(
    IHubContext<NotificationHub> hubContext)
{
    public async Task SendToUser(string userId, string message)
    {
        await hubContext.Clients.User(userId).SendAsync("ReceiveNotification", message);
    }
}
