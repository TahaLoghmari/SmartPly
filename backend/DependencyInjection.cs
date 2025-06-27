using Serilog;

namespace backend;
using backend.Services;
using backend.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Entities;
using FluentValidation;
using backend.Middlewares;

public static class DependencyInjection
{
    public static WebApplicationBuilder AddControllers(this WebApplicationBuilder builder)
    {
        builder.Services.AddControllers();

        builder.Services.AddOpenApi();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp",
                policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
        });

        return builder;
    }

    public static WebApplicationBuilder AddErrorHandling(this WebApplicationBuilder builder)
    {
        builder.Services.AddValidatorsFromAssemblyContaining<Program>();

        builder.Services.AddProblemDetails(options =>
        {
            options.CustomizeProblemDetails = context =>
            {
                context.ProblemDetails.Extensions.TryAdd("requestId", context.HttpContext.TraceIdentifier);
            };
        });

        builder.Services.AddExceptionHandler<ValidationExceptionHandler>();
        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

        return builder;
    }

    public static WebApplicationBuilder AddAuthentication(this WebApplicationBuilder builder)
    {
        builder.Services.AddIdentity<User, IdentityRole>()
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("Database")));

        builder.Services.Configure<JwtAuthOptions>(builder.Configuration.GetSection("Jwt"));
        builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

        JwtAuthOptions jwtAuthOptions = builder.Configuration.GetSection("Jwt").Get<JwtAuthOptions>()!;

        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = jwtAuthOptions.Issuer,
                    ValidAudience = jwtAuthOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtAuthOptions.Key)),

                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if (context.Request.Cookies.ContainsKey("accessToken"))
                        {
                            context.Token = context.Request.Cookies["accessToken"];
                        }
                        return Task.CompletedTask;
                    }
                };
            })
            .AddGoogle(options =>
            {
                options.ClientId = builder.Configuration["Google:ClientId"]!;
                options.ClientSecret = builder.Configuration["Google:ClientSecret"]!;
            });

        builder.Services.AddHttpClient();

        return builder;
    }
    public static WebApplicationBuilder AddServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddTransient<TokenProvider>();
        builder.Services.AddTransient<GoogleTokensProvider>();
        builder.Services.AddTransient<GmailProvider>();
        builder.Services.AddTransient<TokenManagementService>();
        builder.Services.AddScoped<CookieService>();
        builder.Services.AddTransient<EmailSenderService>();
        return builder; 
    }
    public static WebApplicationBuilder AddLogging(this WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((context, configuration) =>
            configuration.ReadFrom.Configuration(context.Configuration));
        return builder;
    }
}
