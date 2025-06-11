using backend;
using backend.Extensions;


WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder
    .AddControllers()
    .AddAuthentication()
    .AddErrorHandling()
    .AddServices();

var app = builder.Build();

if ( app.Environment.IsDevelopment() )
{
    app.MapOpenApi();
    await app.ApplyMigrationsAsync();
}
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.UseExceptionHandler();

app.MapControllers();

app.Run();
