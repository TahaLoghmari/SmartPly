FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080


FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY *.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet build -c Release -o /app/build


FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false


FROM build AS dev
WORKDIR /src
CMD ["dotnet", "watch", "run", "--urls", "http://+:8080"]


FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]
