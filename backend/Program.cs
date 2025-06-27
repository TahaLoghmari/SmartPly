using backend;
using backend.Extensions;
using Serilog;


WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder
    .AddControllers()
    .AddAuthentication()
    .AddErrorHandling()
    .AddServices()
    .AddLogging();

var app = builder.Build();

if ( app.Environment.IsDevelopment() )
{
    app.MapOpenApi();
    await app.ApplyMigrationsAsync();
}
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health");

app.UseExceptionHandler();

app.MapControllers();

app.UseSerilogRequestLogging();

app.Run();
