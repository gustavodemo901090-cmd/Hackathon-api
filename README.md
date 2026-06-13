# API Node.js — Portal de Estágios UniALFA

API RESTful desenvolvida em Node.js + TypeScript para o Portal de Estágios da UniALFA. Serve como camada intermediária entre o Front-end PHP, Back Office Java e o banco de dados MySQL.

---

## Problema e solução

Alunos precisam encontrar vagas de estágio e acompanhar candidaturas, enquanto empresas
precisam cadastrar e gerenciar suas oportunidades. A API centraliza essas operações e impede
que os módulos PHP e Java acessem o banco de dados diretamente.

## Objetivo

Fornecer endpoints RESTful para vagas, candidaturas e notificações, aplicando validações,
regras de negócio, persistência em MySQL e respostas JSON padronizadas.

---

## Stack

- **Node.js** + **TypeScript**
- **Express** — framework HTTP
- **TypeORM** — ORM com suporte a migrations
- **MySQL** — banco de dados
- **Zod** — validação de schemas
- **Helmet** + **CORS** — segurança e controle de acesso

---

## Instalação

### 1. Clone e instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com as credenciais do seu banco MySQL:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=sua_senha
DB_NAME=portal_estagios
```

### 3. Crie o banco de dados

```sql
CREATE DATABASE portal_estagios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Execute as migrations

```bash
npm run migration:run
```

### 5. Execute os seeds (opcional)

```bash
npm run seed
```

### 6. Inicie o servidor em modo desenvolvimento

```bash
npm run dev
```

---

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento com hot-reload |
| `npm run migration:run` | Executa as migrations pendentes |
| `npm run migration:revert` | Reverte a última migration |
| `npm run migration:show` | Exibe migrations executadas e pendentes |
| `npm run migration:generate` | Gera nova migration baseada nas entidades |
| `npm run seed` | Popula o banco com dados de teste |

---

## Estrutura do projeto

```
src/
├── config/
│   └── data-source.ts       # Configuração do TypeORM/MySQL
├── controllers/             # Camada de controle (req/res)
├── services/                # Regras de negócio
├── entities/                # Entidades TypeORM
├── routes/                  # Definição das rotas
├── middlewares/             # Error handler, validação
├── schemas/                 # Schemas Zod
├── errors/                  # Classe AppError
├── migrations/              # Migrations do banco
├── seeds/                   # Dados de teste
└── server.ts                # Entry point
```

---

## Endpoints

### Alunos — `/api/alunos`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/alunos` | Cadastrar aluno |
| GET | `/api/alunos` | Listar todos os alunos |
| GET | `/api/alunos/:id` | Buscar aluno por ID |
| PUT | `/api/alunos/:id` | Atualizar aluno |
| DELETE | `/api/alunos/:id` | Remover aluno |

### Empresas — `/api/empresas`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/empresas` | Cadastrar empresa |
| GET | `/api/empresas` | Listar todas as empresas |
| GET | `/api/empresas/:id` | Buscar empresa por ID |
| PUT | `/api/empresas/:id` | Atualizar empresa |
| DELETE | `/api/empresas/:id` | Remover empresa |
| PATCH | `/api/empresas/:id/aprovar` | Aprovar empresa |
| PATCH | `/api/empresas/:id/bloquear` | Bloquear empresa |

### Vagas — `/api/vagas`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/vagas` | Criar vaga |
| GET | `/api/vagas` | Listar todas as vagas |
| GET | `/api/vagas/ativas` | Listar vagas ativas |
| GET | `/api/vagas/empresa/:empresaId` | Listar vagas por empresa |
| GET | `/api/vagas/:id` | Buscar vaga por ID |
| PUT | `/api/vagas/:id` | Atualizar vaga |
| DELETE | `/api/vagas/:id` | Remover vaga |

### Candidaturas — `/api/candidaturas`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/candidaturas` | Realizar candidatura |
| GET | `/api/candidaturas` | Listar todas as candidaturas |
| GET | `/api/candidaturas/:id` | Buscar candidatura por ID |
| PUT | `/api/candidaturas/:id` | Atualizar status da candidatura |
| DELETE | `/api/candidaturas/:id` | Remover candidatura |

### Notificações — `/api/notificacoes`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/notificacoes` | Listar notificações (`?alunoId=1` opcional) |
| PATCH | `/api/notificacoes/:id/lida` | Marcar notificação como lida |

---

## Padrão de resposta

**Sucesso:**
```json
{
  "success": true,
  "data": {}
}
```

**Erro:**
```json
{
  "success": false,
  "message": "Mensagem de erro"
}
```

---

## Regras de negócio

- Empresa com status `PENDENTE` ou `BLOQUEADA` não pode criar vagas
- Vaga com status `ENCERRADA` não aceita novas candidaturas
- Aluno não pode se candidatar duas vezes à mesma vaga
- Aluno deve ter `aptoEstagio = true` para se candidatar
- Ao realizar uma candidatura, o aluno recebe uma notificação automática
- Ao atualizar o status de uma candidatura, o aluno recebe uma notificação

---

## Enums

**Empresa — status:** `PENDENTE` | `APROVADA` | `BLOQUEADA`

**Vaga — modalidade:** `PRESENCIAL` | `REMOTO` | `HIBRIDO`

**Vaga — status:** `ATIVA` | `ENCERRADA`

**Candidatura — status:** `PENDENTE` | `EM_ANALISE` | `APROVADA` | `REPROVADA`

---

## Cobertura dos requisitos Node.js

| Requisito do Hackathon | Implementação |
|---|---|
| API RESTful | Express com rotas em `/api` |
| Vagas | CRUD completo e listagem de vagas ativas ou por empresa |
| Candidaturas | CRUD completo, validação de aluno e vaga |
| Notificações | Criação automática e endpoint para listar e marcar como lida |
| Banco relacional | MySQL com TypeORM |
| Arquitetura modular | Rotas, controllers, services, entities e schemas separados |
| Migrations | Estrutura do banco em `src/migrations` |
| Seeds | Carga inicial em `src/seeds/seed.ts` |
| Respostas JSON | Padrão `success`, `data` e `message` |
| Códigos HTTP | 200, 201, 204, 400, 403, 404, 409 e 500 |
| Validação | Schemas Zod nas operações de criação e atualização |
| Tratamento de erros | Middleware global e resposta 404 para rotas inexistentes |
| Integração PHP | CORS habilitado e acesso ao banco centralizado pela API |

---

## Verificações realizadas

- Verificação estática do TypeScript com `npx tsc --noEmit`
- Leitura das migrations com `npm run migration:show`
- Conferência das rotas, schemas Zod, regras de negócio e respostas HTTP

## Integrantes e contribuições

Preencher esta seção com os nomes dos integrantes e as respectivas contribuições antes da
entrega, conforme solicitado na parte de documentação do Hackathon.
