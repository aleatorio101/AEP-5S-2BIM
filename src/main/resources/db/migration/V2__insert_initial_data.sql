-- ─── EduAlerta – V2: Dados iniciais ──────────────────────────────────────────
-- Senhas geradas com BCrypt (rounds=10).
-- admin@edualerta.com  → senha: admin123
-- atendente@escola.com → senha: edu2026

INSERT INTO usuarios (nome, email, senha, tipo_usuario, role)
VALUES
    (
        'Administrador',
        'admin@edualerta.com',
        '$2a$10$M5jFZnny3.NeqPq7NuyReON/XXsGR47pIVOfw5rPDGphVdtz5l79i',
        'FUNCIONARIO',
        'ADMIN'
    ),
    (
        'Atendente Escola',
        'atendente@escola.com',
        '$2a$10$7RepGtu6ERAGI0TlDpsUmuvHsbrAFiIw6aABTfdBR6zTANzpXxnk2',
        'FUNCIONARIO',
        'ATENDENTE'
    );