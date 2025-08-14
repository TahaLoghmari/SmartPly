using backend;
using backend.Extensions;
using backend.Services;
using Hangfire;
using Serilog;


WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder
    .AddControllers()
    .AddAuthentication()
    .AddErrorHandling()
    .AddServices()
    .AddLogging()
    .AddSwagger()
    .AddRateLimiting()
    .AddCaching()
    .AddSupabase()
    .AddHangfire();

var app = builder.Build();

if ( app.Environment.IsDevelopment() )
{
    app.UseSwagger();
    app.UseSwaggerUI();
    await app.ApplyMigrationsAsync();
}
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health");

app.UseExceptionHandler();

app.MapControllers();

app.UseSerilogRequestLogging();
app.UseRateLimiter();
app.UseHangfireDashboard("/hangfire-dashboard");
// app.UseHangfireDashboard("/hangfire-dashboard", new DashboardOptions
// {
//     Authorization = new[] { new DashboardAuthorizationFilter() }
// });
var supabaseService = app.Services.GetRequiredService<SupabaseService>();
await supabaseService.InitializeAsync();
app.ConfigureRecurringJobs();

app.Run();
