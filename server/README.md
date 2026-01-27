# Mentora API - Clean Architecture

Projeto .NET 9 com arquitetura Clean Architecture para o sistema Mentora.

## Estrutura do Projeto

```
server/
├── src/
│   ├── Mentora.API/           # Camada de apresentação (Controllers, API)
│   ├── Mentora.Application/   # Camada de aplicação (Use Cases, Services, DTOs)
│   ├── Mentora.Domain/        # Camada de domínio (Entities, Interfaces)
│   └── Mentora.Infrastructure/# Camada de infraestrutura (Repositories, DbContext, Migrations)
└── Mentora.sln
```

## Tecnologias

- .NET 9
- ASP.NET Core Web API
- Entity Framework Core 9
- PostgreSQL (Npgsql)
- Clean Architecture

## Configuração Inicial

### 1. PostgreSQL

Certifique-se de ter o PostgreSQL instalado e rodando.

### 2. Connection String

Configure a connection string em `src/Mentora.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=mentora_db;Username=postgres;Password=SUA_SENHA"
  }
}
```

### 3. Criar o banco de dados

Execute as migrations para criar o banco:

```bash
cd server
dotnet ef database update --project src/Mentora.Infrastructure --startup-project src/Mentora.API
```

Isso irá criar:
- Banco de dados `mentora_db`
- Tabela `Users`
- Usuário Master seed (master@email.com)

## Como executar

```bash
cd server
dotnet restore
dotnet run --project src/Mentora.API
```

A API estará disponível em:
- HTTPS: https://localhost:7000
- HTTP: http://localhost:5000

## Endpoints

### POST /api/auth/login
Login de usuário

**Request:**
```json
{
  "email": "master@email.com",
  "password": "qualquer_senha"
}
```

**Response (sucesso):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "mock-token-guid",
  "user": {
    "id": "guid",
    "email": "master@email.com",
    "name": "Master Administrador",
    "role": "Master"
  }
}
```

**Response (usuário não encontrado):**
```json
{
  "success": false,
  "message": "Usuário não encontrado"
}
```

## Perfis de Usuário

- **Aluno**: Acesso padrão do sistema
- **Admin**: Administrador com permissões elevadas
- **Master**: Super administrador (master@email.com)

## Migrations

Veja [MIGRATIONS.md](MIGRATIONS.md) para mais informações sobre migrations.
