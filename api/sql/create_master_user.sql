-- Inserir usuário master
INSERT INTO User (
    id,
    name,
    email,
    password,
    role,
    createdAt,
    updatedAt
) VALUES (
    UUID(),
    'Administrador',
    'admin@donnanegociacoes.com.br',
    '$2y$10$N9qO6vVHnw.BR/U7BX2rmeJ0zBWGZwbPVAeCScrWnPxpvWP4jKrMO', -- senha: admin123
    'MASTER',
    NOW(),
    NOW()
); 