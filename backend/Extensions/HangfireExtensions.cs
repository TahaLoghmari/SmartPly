using backend.Services;
using Hangfire;

namespace backend.Extensions;

public static class HangfireExtensions
{
    public static WebApplication ConfigureRecurringJobs(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        
        RecurringJob.AddOrUpdate<TokenManagementService>(
            "cleanup-expired-tokens",
            service => service.CleanupExpiredTokens(),
            Cron.Daily);

        return app;
    }
}