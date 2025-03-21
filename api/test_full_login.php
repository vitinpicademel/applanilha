<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once 'config/database.php';

try {
    $result = [
        'steps' => [],
        'request' => [],
        'response' => []
    ];

    // Simular dados do login
    $loginData = [
        'email' => 'admin@donnanegociacoes.com.br',
        'password' => 'admin123'
    ];

    $result['request'] = $loginData;

    // Conectar ao banco
    $database = new Database();
    $db = $database->getConnection();

    $result['steps'][] = [
        'step' => 'Conexão com o banco',
        'status' => ($db !== null) ? 'success' : 'error'
    ];

    // Buscar usuário
    $stmt = $db->prepare('SELECT * FROM User WHERE email = ?');
    $stmt->execute([$loginData['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        $result['steps'][] = [
            'step' => 'Busca de usuário',
            'status' => 'error',
            'message' => 'Usuário não encontrado'
        ];
        throw new Exception('Usuário não encontrado');
    }

    $result['steps'][] = [
        'step' => 'Busca de usuário',
        'status' => 'success',
        'user_found' => true
    ];

    // Verificar senha
    $isValidPassword = password_verify($loginData['password'], $user['password']);

    $result['steps'][] = [
        'step' => 'Verificação de senha',
        'status' => $isValidPassword ? 'success' : 'error',
        'is_valid' => $isValidPassword
    ];

    if (!$isValidPassword) {
        throw new Exception('Senha inválida');
    }

    // Remover senha do objeto do usuário
    unset($user['password']);

    // Preparar resposta final
    $response = [
        'success' => true,
        'user' => $user
    ];

    $result['response'] = $response;
    $result['final_status'] = 'success';

    echo json_encode($result, JSON_PRETTY_PRINT);

} catch (Exception $e) {
    $result['final_status'] = 'error';
    $result['error'] = $e->getMessage();
    echo json_encode($result, JSON_PRETTY_PRINT);
}
?>