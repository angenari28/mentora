using Mentora.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mentora.Infrastructure.Data.Initializer;

public static class CourseSlideInitializer
{
    private static readonly Guid SlideTypeTextoId = new Guid("a1b2c3d4-0001-0000-0000-000000000001");

    public static void Initialize(ModelBuilder modelBuilder, Guid courseId)
    {
        var now = new DateTime(2026, 1, 23, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<CourseSlide>().HasData(
            new CourseSlide
            {
                Id = new Guid("c1d2e3f4-a5b6-7890-cdef-012345678901"),
                CourseId = courseId,
                SlideTypeId = SlideTypeTextoId,
                Title = "Introdução ao Node.js",
                Content = "O que é: Um ambiente de execução (runtime) de código aberto que permite rodar JavaScript no lado do servidor (back-end).\n\nA Tecnologia Base: Construído sobre a poderosa engine V8 do Google Chrome, que compila o JavaScript diretamente para código de máquina, garantindo alta velocidade.\n\nO Paradigma Full-Stack: Unifica a stack de desenvolvimento, permitindo que as equipes usem a mesma linguagem (JavaScript/TypeScript) tanto no front-end quanto no back-end.",
                Ordering = 1,
                Active = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new CourseSlide
            {
                Id = new Guid("c1d2e3f4-a5b6-7890-cdef-012345678902"),
                CourseId = courseId,
                SlideTypeId = SlideTypeTextoId,
                Title = "Arquitetura Assíncrona e Event Loop",
                Content = "Modelo Single-Thread: Diferente de servidores tradicionais que criam uma nova thread para cada requisição, o Node opera em uma thread principal (Single-Thread).\n\nI/O Não Bloqueante: Operações demoradas de entrada e saída (como ler um arquivo ou buscar dados no banco) não travam o sistema. A aplicação continua atendendo outras requisições simultaneamente.\n\nO Coração do Node (Event Loop): É o mecanismo responsável por delegar as tarefas pesadas ao sistema operacional e emitir um \"evento\" ou \"callback\" quando elas são concluídas, mantendo a alta escalabilidade e baixo consumo de memória.",
                Ordering = 2,
                Active = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new CourseSlide
            {
                Id = new Guid("c1d2e3f4-a5b6-7890-cdef-012345678903"),
                CourseId = courseId,
                SlideTypeId = SlideTypeTextoId,
                Title = "O Ecossistema e o NPM",
                Content = "Node Package Manager (NPM): O gerenciador de pacotes padrão que já vem instalado junto com o Node.js.\n\nA Maior Biblioteca do Mundo: Dá acesso ao maior repositório de bibliotecas de código aberto do mundo, permitindo que os desenvolvedores não precisem \"reinventar a roda\" em cada projeto.\n\nO Arquivo package.json: O centro de controle do projeto, onde ficam registradas todas as dependências (bibliotecas utilizadas), versões e scripts de automação.",
                Ordering = 3,
                Active = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new CourseSlide
            {
                Id = new Guid("c1d2e3f4-a5b6-7890-cdef-012345678904"),
                CourseId = courseId,
                SlideTypeId = SlideTypeTextoId,
                Title = "Principais Frameworks",
                Content = "Express.js: O padrão de mercado para construção de servidores. É minimalista, flexível e facilita muito a criação de rotas e integração com bancos de dados.\n\nNestJS: Um framework mais robusto e opinativo (com regras de arquitetura bem definidas), muito usado em aplicações corporativas complexas. Tem suporte nativo ao TypeScript.\n\nFastify: Uma alternativa em grande ascensão, focada em entregar a mais alta performance e velocidade no processamento das requisições.",
                Ordering = 4,
                Active = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new CourseSlide
            {
                Id = new Guid("c1d2e3f4-a5b6-7890-cdef-012345678905"),
                CourseId = courseId,
                SlideTypeId = SlideTypeTextoId,
                Title = "Casos de Uso Ideais (Onde o Node Brilha)",
                Content = "APIs Rápidas e Escaláveis: Ideal para construir APIs RESTful ou GraphQL que servem dados em formato JSON para aplicações web e mobile.\n\nAplicações em Tempo Real: Excelente para sistemas de chat, streaming de dados, plataformas de colaboração ao vivo e jogos multiplayer, geralmente utilizando tecnologias como WebSockets.\n\nArquitetura de Microsserviços: Sua leveza torna o Node.js perfeito para criar aplicações modernas baseadas em pequenos serviços independentes que se comunicam entre si.",
                Ordering = 5,
                Active = true,
                CreatedAt = now,
                UpdatedAt = now
            }
        );
    }
}
