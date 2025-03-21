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
if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados incompletos']);
    exit();
}

// Arquivo onde os usuários serão salvos
$usersFile = '../data/users.json';

// Cria o diretório data se não existir
if (!file_exists('../data')) {
    mkdir('../data', 0777, true);
}

// Carrega usuários existentes ou cria array vazio
if (file_exists($usersFile)) {
    $users = json_decode(file_get_contents($usersFile), true);
} else {
    $users = [];
}

// Verifica se o email já existe
foreach ($users as $user) {
    if ($user['email'] === $data['email']) {
        http_response_code(400);
        echo json_encode(['error' => 'Email já cadastrado']);
        exit();
    }
}

// Cria novo usuário
$newUser = [
    'id' => uniqid(),
    'name' => $data['name'],
    'email' => $data['email'],
    'password' => password_hash($data['password'], PASSWORD_DEFAULT),
    'role' => $data['role'] ?? 'user',
    'team_id' => $data['team_id'] ?? '1',
    'created_at' => date('Y-m-d H:i:s')
];

// Adiciona o novo usuário ao array
$users[] = $newUser;

// Salva no arquivo
if (file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT))) {
    http_response_code(201);
    echo json_encode(['message' => 'Usuário criado com sucesso', 'user' => $newUser]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao salvar usuário']);
}
?> 