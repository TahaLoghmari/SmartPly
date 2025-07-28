using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using FluentValidation;
namespace backend.Middlewares;

public sealed class CustomExceptionHandler(
    IProblemDetailsService problemDetailsService,
    ILogger<CustomExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        ProblemDetails problemDetails = new();

        switch (exception)
        {
            case NotFoundException notFound:
                httpContext.Response.StatusCode = StatusCodes.Status404NotFound;
                problemDetails.Title = "Not Found";
                problemDetails.Detail = notFound.Message;
                problemDetails.Status = StatusCodes.Status404NotFound;
                break;

            case BadRequestException badRequest:
                httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                problemDetails.Title = "Bad Request";
                problemDetails.Detail = badRequest.Message;
                problemDetails.Status = StatusCodes.Status400BadRequest;
                break;

            case UnauthorizedException unauthorized:
                httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                problemDetails.Title = "Unauthorized";
                problemDetails.Detail = unauthorized.Message;
                problemDetails.Status = StatusCodes.Status401Unauthorized;
                break;
            case ValidationException validation:
                httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                problemDetails.Title = "Validation Failed";
                problemDetails.Detail = "One or more validation errors occurred.";
                problemDetails.Status = StatusCodes.Status400BadRequest;
                problemDetails.Extensions["errors"] = validation.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.ErrorMessage).ToArray()
                    );
                break;
            default:
                return false;
        }

        logger.LogWarning("Handled exception: {ExceptionType} - {Message}", exception.GetType().Name, exception.Message);

        var context = new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = problemDetails
        };

        return await problemDetailsService.TryWriteAsync(context);
    }
}