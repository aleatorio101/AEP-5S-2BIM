-- ─── EduAlerta – V1: Criação das tabelas ─────────────────────────────────────

-- Sequence para geração de protocolos (CH-2026-000001)
-- Sobrevive a restarts e suporta múltiplas instâncias da aplicação.
CREATE SEQUENCE IF NOT EXISTS chamado_protocol_seq START 1 INCREMENT 1 NO MAXVALUE CACHE 1;

CREATE TABLE usuarios (
    id           BIGSERIAL    PRIMARY KEY,
    nome         VARCHAR(150) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    senha        VARCHAR(255) NOT NULL,
    telefone     VARCHAR(20),
    tipo_usuario VARCHAR(30)  NOT NULL,
    role         VARCHAR(20)  NOT NULL DEFAULT 'CIDADAO',
    ativo        BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE chamados (
    id                    BIGSERIAL    PRIMARY KEY,
    protocolo             VARCHAR(20)  NOT NULL UNIQUE,
    titulo                VARCHAR(100) NOT NULL,
    descricao             TEXT         NOT NULL,
    categoria             VARCHAR(40)  NOT NULL,
    urgencia              VARCHAR(20)  NOT NULL,
    status                VARCHAR(30)  NOT NULL DEFAULT 'EM_ANALISE',

    -- localização
    bloco                 VARCHAR(50),
    sala                  VARCHAR(50),
    data_ocorrencia       DATE,
    horario_ocorrencia    TIME,

    -- requerente
    anonimo               BOOLEAN      NOT NULL DEFAULT FALSE,
    usuario_id            BIGINT       REFERENCES usuarios(id) ON DELETE SET NULL,
    email_contato_anonimo VARCHAR(255),
    nome_requerente       VARCHAR(150),

    -- controle
    data_abertura         TIMESTAMP    NOT NULL DEFAULT NOW(),
    data_fechamento       TIMESTAMP
);

CREATE INDEX idx_chamados_status       ON chamados(status);
CREATE INDEX idx_chamados_categoria    ON chamados(categoria);
CREATE INDEX idx_chamados_usuario      ON chamados(usuario_id);
CREATE INDEX idx_chamados_data         ON chamados(data_abertura DESC);

CREATE TABLE movimentacoes (
    id               BIGSERIAL    PRIMARY KEY,
    chamado_id       BIGINT       NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
    data_hora        TIMESTAMP    NOT NULL DEFAULT NOW(),
    status_anterior  VARCHAR(30)  NOT NULL,
    status_novo      VARCHAR(30)  NOT NULL,
    responsavel      VARCHAR(150) NOT NULL,
    observacao       TEXT
);

CREATE INDEX idx_movimentacoes_chamado ON movimentacoes(chamado_id);

CREATE TABLE evidencias (
    id                BIGSERIAL    PRIMARY KEY,
    chamado_id        BIGINT       NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
    nome_original     VARCHAR(255) NOT NULL,
    nome_armazenado   VARCHAR(255) NOT NULL UNIQUE,
    content_type      VARCHAR(100) NOT NULL,
    tamanho_bytes     BIGINT,
    enviado_em        TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evidencias_chamado ON evidencias(chamado_id);
