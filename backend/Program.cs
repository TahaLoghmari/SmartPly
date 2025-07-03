using backend;
using backend.Extensions;
using Serilog;


WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder
    .AddControllers()
    .AddAuthentication()
    .AddErrorHandling()
    .AddServices()
    .AddLogging()
    .AddSwagger();

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

app.Run();
