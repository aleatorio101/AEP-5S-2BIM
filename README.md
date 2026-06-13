# EduAlerta API

Sistema de chamados escolares — Spring Boot 3.4 + Spring Security + JWT + PostgreSQL.

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Java       | 21            |
| Docker     | 24+           |
| Docker Compose | 2.x       |
| Maven      | 3.9 (ou use o `./mvnw`) |

---

## Subir o projeto

### 1. Apenas o banco (desenvolvimento local)

```bash
docker compose up db -d
```

### 2. Stack completa (banco + API)

```bash
docker compose up --build
```

A API estará disponível em `http://localhost:8080`.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz (nunca commite em produção):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=edualerta
DB_USER=edualerta
DB_PASS=edualerta

# Gere com: openssl rand -base64 64
JWT_SECRET=troque_isso_em_producao

JWT_EXPIRATION_MS=86400000   # 24h
UPLOAD_DIR=uploads
```

---

## Executar localmente (sem Docker)

```bash
# 1. Suba só o banco
docker compose up db -d

# 2. Execute a aplicação
./mvnw spring-boot:run
```
## Executar front do projeto

```bash
# 1. abra o cmd na pasta /frontend
npm install

# 2. depois no mesmo cmd
npm run dev
```

---

## Documentação da API (Swagger)

Acesse `http://localhost:8080/swagger-ui.html` após subir a aplicação.

---

## Usuários padrão (criados pelo Flyway)

| E-mail                   | Senha    | Role      |
|--------------------------|----------|-----------|
| admin@edualerta.com      | admin123 | ADMIN     |
| atendente@escola.com     | edu2026  | ATENDENTE |

> **Troque as senhas imediatamente em produção!**

---

## Endpoints principais

### Auth (público)
| Método | Rota                  | Descrição                  |
|--------|-----------------------|----------------------------|
| POST   | `/api/auth/register`  | Criar conta (cidadão)      |
| POST   | `/api/auth/login`     | Login → retorna JWT        |

### Chamados (cidadão)
| Método | Rota                                        | Descrição                          |
|--------|---------------------------------------------|------------------------------------|
| POST   | `/api/chamados`                             | Abrir chamado (autenticado)        |
| POST   | `/api/chamados/anonimo`                     | Abrir chamado sem login            |
| GET    | `/api/chamados/meus`                        | Meus chamados (filtros, paginação) |
| GET    | `/api/chamados/acompanhar/{protocolo}`      | Acompanhar por protocolo (público) |
| POST   | `/api/chamados/{protocolo}/evidencias`      | Anexar arquivo                     |
| GET    | `/api/chamados/{protocolo}/evidencias/{id}` | Baixar arquivo                     |

### Perfil do usuário autenticado *(novo)*
| Método | Rota               | Descrição                                     |
|--------|--------------------|-----------------------------------------------|
| GET    | `/api/usuarios/me` | Consultar próprios dados (nome, CPF, RG, CEP) |
| PUT    | `/api/usuarios/me` | Atualizar próprios dados                      |

### Admin / Atendente
| Método | Rota                                     | Descrição                    |
|--------|------------------------------------------|------------------------------|
| GET    | `/api/admin/chamados`                    | Listar todos (com filtros)   |
| GET    | `/api/admin/chamados/{protocolo}`        | Detalhe do chamado           |
| PATCH  | `/api/admin/chamados/{protocolo}/status` | Atualizar status             |
| GET    | `/api/admin/estatisticas`                | Dashboard de totais          |

### Gestão de usuários (somente ADMIN)
| Método | Rota                                 | Descrição          |
|--------|--------------------------------------|--------------------|
| GET    | `/api/admin/usuarios`                | Listar usuários    |
| GET    | `/api/admin/usuarios/{id}`           | Buscar por ID      |
| PATCH  | `/api/admin/usuarios/{id}/role`      | Alterar role       |
| PATCH  | `/api/admin/usuarios/{id}/desativar` | Desativar conta    |
| PATCH  | `/api/admin/usuarios/{id}/reativar`  | Reativar conta     |

### Referência (público)
| Método | Rota                       | Descrição            |
|--------|----------------------------|----------------------|
| GET    | `/api/categorias`          | Lista de categorias  |
| GET    | `/api/enums/status`        | Status possíveis     |
| GET    | `/api/enums/urgencias`     | Níveis de urgência   |
| GET    | `/api/enums/tipos-usuario` | Tipos de usuário     |

---

## Formato do JWT

```
Authorization: Bearer <token>
```

---

## Roles e permissões

| Role      | O que pode fazer                                            |
|-----------|-------------------------------------------------------------|
| CIDADAO   | Abrir chamados, ver os próprios, acompanhar por protocolo   |
| ATENDENTE | Tudo do cidadão + ver todos os chamados, atualizar status   |
| ADMIN     | Tudo do atendente + gerenciar usuários, alterar roles       |

---

## Estrutura do projeto

```
src/main/java/com/edualerta/
├── config/          SecurityConfig, OpenApiConfig
├── controller/      AuthController, ChamadoController, AdminController,
│                    AdminUsuarioController, UsuarioController, EnumController
├── domain/
│   ├── entity/      Usuario, Chamado, Movimentacao, Evidencia
│   └── enums/       Categoria, Status, Urgencia, Role, TipoUsuario
├── dto/
│   ├── request/     LoginRequest, RegisterRequest, AbrirChamadoRequest,
│   │                AtualizarStatusRequest, AlterarRoleRequest, AtualizarMeRequest
│   └── response/    AuthResponse, ChamadoResumoResponse, ChamadoDetalheResponse,
│                    MovimentacaoResponse, EvidenciaResponse, EstatisticasResponse,
│                    UsuarioResponse
├── exception/       GlobalExceptionHandler, ResourceNotFoundException, BusinessException
├── repository/      UsuarioRepository, ChamadoRepository
├── security/        JwtService, JwtAuthenticationFilter, UserDetailsServiceImpl
└── service/         AuthService, ChamadoService, UsuarioService
```

---

## CI/CD (GitHub Actions)

O pipeline `.github/workflows/ci.yml` executa automaticamente:

1. **Build e testes** — em todo push para `main` ou `develop`
2. **Docker build + push** para o GitHub Container Registry — apenas em push para `main`

Para habilitar o deploy automático, descomente a job `deploy` no workflow e configure os secrets:
- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY`

---

## Migrações do banco (Flyway)

| Arquivo                       | O que faz                                           |
|-------------------------------|-----------------------------------------------------|
| `V1__create_tables.sql`       | Cria todas as tabelas e indexes                     |
| `V2__insert_initial_data.sql` | Insere usuários admin e atendente                   |
| `V3__add_usuario_campos.sql`  | Adiciona colunas `cpf`, `rg` e `cep` em `usuarios` |

Para adicionar uma nova migration, crie `V4__descricao.sql` seguindo o padrão.

---

## Segurança em produção

- Troque o `JWT_SECRET` por uma chave aleatória de 256+ bits
- Configure CORS com a URL exata do frontend
- Não exponha a porta do banco externamente
- Use HTTPS (configure um reverse proxy: Nginx / Caddy)
