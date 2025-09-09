FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /source

COPY *.csproj ./
RUN --mount=type=cache,id=nuget,target=/root/.nuget/packages \
    dotnet restore

COPY . .
ARG TARGETARCH=amd64
RUN --mount=type=cache,id=nuget,target=/root/.nuget/packages \
    dotnet publish -c Release -a ${TARGETARCH/amd64/x64} --use-current-runtime --self-contained false -o /app

FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS final
WORKDIR /app


RUN apk add --no-cache ca-certificates curl

USER app

COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:8080
ENV DOTNET_USE_POLLING_FILE_WATCHER=false

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl --fail --silent --show-error http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "backend.dll"]