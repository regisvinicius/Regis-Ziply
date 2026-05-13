# Ziply

Aplicação FullStack para encurtamento de URLs.

O projeto permite criar links encurtados com código personalizado, listar links cadastrados, remover links, contabilizar acessos, redirecionar para a URL original e exportar um relatório em CSV.

## Stack

- Web: React 19, Vite 6, Tailwind CSS, React Query, React Hook Form e Zod
- API: Fastify, Drizzle ORM, PostgreSQL e Zod
- Storage: Cloudflare R2 / LocalStack para exportação CSV
- Tooling: pnpm workspaces, Biome, Vitest e Docker Compose

## Funcionalidades

- Cadastro de links encurtados
- Validação de URL e código curto
- Redirecionamento para a URL original
- Contador de acessos por link
- Listagem dos links criados
- Remoção de links
- Exportação de relatório em CSV

## Rodando localmente

Pré-requisitos:

- Node.js 22+
- pnpm 10+
- Docker

Comandos:

    pnpm infra:up
    pnpm install

    cp .env.example .env
    cp server/.env.example server/.env
    cp web/.env.example web/.env

    docker compose exec localstack awslocal s3 mb s3://ziply-csv-exports

    pnpm db:migrate
    pnpm dev
