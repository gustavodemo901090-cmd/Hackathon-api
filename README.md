# API Node.js — Portal de Estágios UniALFA

API RESTful desenvolvida em Node.js + TypeScript para o Portal de Estágios da UniALFA.

## Stack

- **Node.js** + **TypeScript**
- **Express** — framework HTTP
- **TypeORM** — ORM com suporte a migrations
- **MySQL** — banco de dados
- **Zod** — validação de schemas
- **Helmet** + **CORS** — segurança e controle de acesso

## Instalação

### 1. Clone o repositório e instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com as credenciais do seu banco MySQL.

### 3. Execute as migrations

```bash
npm run migration:run
```

### 4. Inicie o servidor em desenvolvimento

```bash
npm run dev
```

## Endpoints

### Health Check
- `GET /api/health` — Status da API

### Alunos (CRUD)
- `POST /api/alunos` — Criar aluno
- `GET /api/alunos` — Listar alunos
- `GET /api/alunos/:id` — Buscar aluno por ID
- `PUT /api/alunos/:id` — Atualizar aluno
- `DELETE /api/alunos/:id` — Deletar aluno

### Candidaturas (CRUD)
- `POST /api/candidaturas` — Criar candidatura
- `GET /api/candidaturas` — Listar candidaturas
- `GET /api/candidaturas/:id` — Buscar candidatura por ID
- `PUT /api/candidaturas/:id` — Atualizar candidatura (status)
- `DELETE /api/candidaturas/:id` — Deletar candidatura

## Estrutura

```
src/
├── server.ts              # Entrada da aplicação
├── app.ts                 # Configuração do Express
├── config/
│   └── data-source.ts     # Configuração do TypeORM
├── entities/
│   ├── Aluno.ts
│   └── Candidatura.ts
├── controllers/
│   ├── AlunoController.ts
│   └── CandidaturaController.ts
├── services/
│   ├── AlunoService.ts
│   └── CandidaturaService.ts
├── routes/
│   ├── index.ts
│   ├── health.routes.ts
│   ├── alunoRoutes.ts
│   └── candidaturaRoutes.ts
├── schemas/
│   ├── alunoSchema.ts
│   └── candidaturaSchema.ts
├── middlewares/
│   └── validateSchema.ts
├── errors/
│   └── AppError.ts
└── migrations/
    ├── 1700000000000-CreateAlunosTable.ts
    └── 1700000000003-CreateCandidaturasTable.ts
```

## Scripts

- `npm run dev` — Modo desenvolvimento
- `npm run build` — Compilar TypeScript
- `npm start` — Iniciar servidor
- `npm run migration:run` — Executar migrations
- `npm run migration:revert` — Reverter última migration
