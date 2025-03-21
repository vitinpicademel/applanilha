<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    $query = 'SELECT id, name, email, role, teamId, createdAt, updatedAt FROM User';
    $params = [];
    
    // Filtrar por role se especificado
    if (isset($_GET['role'])) {
        $query .= ' WHERE role = ?';
        $params[] = $_GET['role'];
    }

    // Filtrar por teamId se especificado
    if (isset($_GET['teamId'])) {
        $query .= isset($_GET['role']) ? ' AND' : ' WHERE';
        $query .= ' teamId = ?';
        $params[] = $_GET['teamId'];
    }

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'users' => $users
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao listar usuários: ' . $e->getMessage()]);
}
?> 