<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
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
    // Verificar se o usuário existe e não é MASTER
    $stmt = $db->prepare('SELECT role FROM User WHERE id = ?');
    $stmt->execute([$data['id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'Usuário não encontrado']);
        exit();
    }

    if ($user['role'] === 'MASTER') {
        http_response_code(403);
        echo json_encode(['error' => 'Não é permitido excluir usuários MASTER']);
        exit();
    }

    $stmt = $db->prepare('DELETE FROM User WHERE id = ?');
    $stmt->execute([$data['id']]);

    echo json_encode([
        'success' => true,
        'message' => 'Usuário excluído com sucesso'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao excluir usuário: ' . $e->getMessage()]);
}
?> 