-- ─── EduAlerta – V2: Dados iniciais ──────────────────────────────────────────
-- Senhas geradas com BCrypt (rounds=10).
-- admin@edualerta.com  → senha: admin123
-- atendente@escola.com → senha: edu2026

INSERT INTO usuarios (nome, email, senha, tipo_usuario, role)
VALUES
    (
        'Administrador',
        'admin@edualerta.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'FUNCIONARIO',
        'ADMIN'
    ),
    (
        'Atendente Escola',
        'atendente@escola.com',
        '$2a$10$TlL7lbJ.iuVb0.7A9Q5RxeL.D6mGI0HkfaXWvMX/1SxnrblQrNNwG',
        'FUNCIONARIO',
        'ATENDENTE'
    );
