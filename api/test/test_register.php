<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/plain; charset=utf-8');

echo "=== TESTE DE REGISTRO DE USUÁRIO ===\n\n";

// 1. Carregar configuração do banco
echo "1. Carregando configuração do banco...\n";
require_once '../config/database.php';
echo "   ✓ Configuração carregada\n\n";

// 2. Conectar ao banco
echo "2. Conectando ao banco de dados...\n";
try {
    $database = new Database();
    $db = $database->getConnection();
    echo "   ✓ Conexão estabelecida\n\n";
} catch (Exception $e) {
    echo "   ✕ Erro na conexão: " . $e->getMessage() . "\n";
    exit;
}

// 3. Criar dados de teste
echo "3. Preparando dados de teste...\n";
$testUser = [
    'name' => 'Usuário Teste ' . time(),
    'email' => 'teste' . time() . '@teste.com',
    'password' => 'senha123',
    'role' => 'CORRETOR',
    'teamId' => 'team_1'
];
echo "   ✓ Dados preparados\n\n";

// 4. Tentar registrar usuário
echo "4. Tentando registrar usuário...\n";
try {
    // Verificar se o email já existe
    $stmt = $db->prepare('SELECT id FROM User WHERE email = ?');
    $stmt->execute([$testUser['email']]);
    if ($stmt->fetch()) {
        echo "   ✕ Email já cadastrado\n";
        exit;
    }

    // Gerar ID único
    $id = uniqid('usr_', true);
    
    // Hash da senha
    $hashedPassword = password_hash($testUser['password'], PASSWORD_DEFAULT);

    // Inserir usuário
    $stmt = $db->prepare('
        INSERT INTO User (id, name, email, password, role, teamId, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    ');

    $stmt->execute([
        $id,
        $testUser['name'],
        $testUser['email'],
        $hashedPassword,
        $testUser['role'],
        $testUser['teamId']
    ]);

    echo "   ✓ Usuário registrado com sucesso\n";
    echo "   ID: $id\n";
    echo "   Nome: " . $testUser['name'] . "\n";
    echo "   Email: " . $testUser['email'] . "\n\n";

    // 5. Verificar se o usuário foi salvo
    echo "5. Verificando se o usuário foi salvo...\n";
    $stmt = $db->prepare('SELECT * FROM User WHERE id = ?');
    $stmt->execute([$id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo "   ✓ Usuário encontrado no banco\n";
        echo "   Nome: " . $result['name'] . "\n";
        echo "   Email: " . $result['email'] . "\n";
        echo "   Role: " . $result['role'] . "\n";
        echo "   TeamId: " . $result['teamId'] . "\n";
        echo "   Criado em: " . $result['createdAt'] . "\n";
    } else {
        echo "   ✕ Usuário não encontrado no banco!\n";
    }

} catch (Exception $e) {
    echo "   ✕ Erro ao registrar: " . $e->getMessage() . "\n";
    echo "   Arquivo: " . $e->getFile() . "\n";
    echo "   Linha: " . $e->getLine() . "\n";
}

echo "\n=== FIM DO TESTE ===\n";
?> 