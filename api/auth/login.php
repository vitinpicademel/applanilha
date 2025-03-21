<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit();
}

// Recebe os dados do POST
$data = json_decode(file_get_contents('php://input'), true);

// Valida os dados recebidos
if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados incompletos']);
    exit();
}

// Arquivo onde os usuários estão salvos
$usersFile = '../data/users.json';

// Verifica se o arquivo existe
if (!file_exists($usersFile)) {
    http_response_code(401);
    echo json_encode(['error' => 'Email ou senha inválidos']);
    exit();
}

// Carrega usuários
$users = json_decode(file_get_contents($usersFile), true);

// Procura o usuário pelo email
$foundUser = null;
foreach ($users as $user) {
    if ($user['email'] === $data['email']) {
        $foundUser = $user;
        break;
    }
}

// Verifica se encontrou o usuário e se a senha está correta
if ($foundUser && password_verify($data['password'], $foundUser['password'])) {
    // Remove a senha antes de retornar
    unset($foundUser['password']);
    
    echo json_encode([
        'success' => true,
        'message' => 'Login realizado com sucesso',
        'user' => $foundUser
    ]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Email ou senha inválidos']);
}
?>