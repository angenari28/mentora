# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY ["src/Mentora.API/Mentora.API.csproj", "src/Mentora.API/"]
COPY ["src/Mentora.Application/Mentora.Application.csproj", "src/Mentora.Application/"]
COPY ["src/Mentora.Domain/Mentora.Domain.csproj", "src/Mentora.Domain/"]
COPY ["src/Mentora.Infrastructure/Mentora.Infrastructure.csproj", "src/Mentora.Infrastructure/"]

RUN dotnet restore "src/Mentora.API/Mentora.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/Mentora.API"
RUN dotnet build "Mentora.API.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "Mentora.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Mentora.API.dll"]