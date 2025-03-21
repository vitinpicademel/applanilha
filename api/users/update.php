<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do usuário é obrigatório']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    // Verificar se o usuário existe
    $stmt = $db->prepare('SELECT * FROM User WHERE id = ?');
    $stmt->execute([$data['id']]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'Usuário não encontrado']);
        exit();
    }

    // Construir query de atualização
    $updateFields = [];
    $params = [];
    
    if (isset($data['name'])) {
        $updateFields[] = 'name = ?';
        $params[] = $data['name'];
    }
    
    if (isset($data['email'])) {
        // Verificar se o email já está em uso por outro usuário
        $stmt = $db->prepare('SELECT id FROM User WHERE email = ? AND id != ?');
        $stmt->execute([$data['email'], $data['id']]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Email já está em uso']);
            exit();
        }
        $updateFields[] = 'email = ?';
        $params[] = $data['email'];
    }
    
    if (isset($data['password'])) {
        $updateFields[] = 'password = ?';
        $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
    }
    
    if (isset($data['role'])) {
        $updateFields[] = 'role = ?';
        $params[] = $data['role'];
    }

    if (isset($data['teamId'])) {
        $updateFields[] = 'teamId = ?';
        $params[] = $data['teamId'];
    }

    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode(['error' => 'Nenhum campo para atualizar']);
        exit();
    }

    $params[] = $data['id'];
    $query = 'UPDATE User SET ' . implode(', ', $updateFields) . ', updatedAt = NOW() WHERE id = ?';
    
    $stmt = $db->prepare($query);
    $stmt->execute($params);

    echo json_encode([
        'success' => true,
        'message' => 'Usuário atualizado com sucesso'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao atualizar usuário: ' . $e->getMessage()]);
}
?> 