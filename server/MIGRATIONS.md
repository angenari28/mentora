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

## 3. Criacao automatica de migrations (desenvolvimento)

- Auto ativado em `Development` por padrao. Para desativar, defina `AUTO_MIGRATIONS=false` no ambiente.
- A verificacao usa o estado atual do banco (`__EFMigrationsHistory`) para calcular o proximo sequencial.
- Nome gerado: `TIMESTAMP_SEQUENCIAL` (sem descricao). Ex.: `20260218201500_0002`.
- Se o EF detectar que nao ha mudancas no modelo, nenhuma migration e criada.

## 4. Execute a migration para criar o banco de dados

Na raiz do projeto server, execute:

```bash
dotnet ef database update --project src/Mentora.Infrastructure --startup-project src/Mentora.API
```

Isso ira:
- Criar o banco de dados `mentora_db` (se nao existir)
- Criar a tabela `Users`
- Inserir o usuario Master seed:
  - Email: master@email.com
  - Nome: Master Administrador
  - Role: Master

## 5. Verificar a migration

Para verificar se a migration foi criada corretamente:

```bash
dotnet ef migrations list --project src/Mentora.Infrastructure --startup-project src/Mentora.API
```

## 6. Remover migration (se necessario)

Para remover a última migration:

```bash
dotnet ef migrations remove --project src/Mentora.Infrastructure --startup-project src/Mentora.API
```
