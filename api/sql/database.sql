-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS donnan87_controledevendas;
USE donnan87_controledevendas;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS User (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    teamId VARCHAR(36),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de dados do Excel
CREATE TABLE IF NOT EXISTS ExcelData (
    id VARCHAR(36) PRIMARY KEY,
    corretor VARCHAR(255) NOT NULL,
    parceriaGestor VARCHAR(3) DEFAULT 'NÃO',
    teamId VARCHAR(36) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir usuário master apenas se não existir
INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
SELECT 
    'usr_master_001',
    'Admin Master',
    'admin@donnanegociacoes.com.br',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: password
    'MASTER',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM User WHERE id = 'usr_master_001'
); 