# Instruções para executar as migrations

## 1. Certifique-se de que o PostgreSQL está rodando

Você precisa ter o PostgreSQL instalado e rodando na sua máquina.

## 2. Configure a connection string

Edite o arquivo `appsettings.json` ou `appsettings.Development.json` no projeto Mentora.API com suas credenciais do PostgreSQL:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=mentora_db;Username=postgres;Password=SUA_SENHA"
  }
}
```

## 3. Execute a migration para criar o banco de dados

Na raiz do projeto server, execute:

```bash
dotnet ef database update --project src/Mentora.Infrastructure --startup-project src/Mentora.API
```

Isso irá:
- Criar o banco de dados `mentora_db` (se não existir)
- Criar a tabela `Users`
- Inserir o usuário Master seed:
  - Email: master@email.com
  - Nome: Master Administrador
  - Role: Master

## 4. Verificar a migration

Para verificar se a migration foi criada corretamente:

```bash
dotnet ef migrations list --project src/Mentora.Infrastructure --startup-project src/Mentora.API
```

## 5. Remover migration (se necessário)

Para remover a última migration:

```bash
dotnet ef migrations remove --project src/Mentora.Infrastructure --startup-project src/Mentora.API
```
