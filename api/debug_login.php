<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config/database.php';

function debug_var($var, $name = '') {
    ob_start();
    var_dump($var);
    $output = ob_get_clean();
    return $name . ': ' . $output;
}

try {
    $result = [
        'steps' => [],
        'database_info' => [],
        'test_user' => []
    ];

    // Passo 1: Testar conexão com o banco
    $database = new Database();
    $db = $database->getConnection();
    
    $result['steps'][] = [
        'step' => 1,
        'name' => 'Conexão com o banco',
        'status' => ($db !== null) ? 'success' : 'error'
    ];

    if ($db) {
        // Passo 2: Informações do banco
        $stmt = $db->query("SELECT DATABASE()");
        $dbName = $stmt->fetchColumn();
        $result['database_info'] = [
            'database_name' => $dbName,
            'connection_status' => 'connected'
        ];

        // Passo 3: Testar usuário master
        $email = 'admin@donnanegociacoes.com.br';
        $password = 'admin123';
        
        $stmt = $db->prepare('SELECT * FROM User WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $result['test_user'] = [
                'found' => true,
                'email' => $email,
                'id' => $user['id'],
                'name' => $user['name'],
                'role' => $user['role'],
                'password_hash_exists' => !empty($user['password']),
                'password_hash' => $user['password']
            ];

            // Testar verificação de senha
            $isValidPassword = password_verify($password, $user['password']);
            $result['password_test'] = [
                'is_valid' => $isValidPassword,
                'test_password' => $password,
                'verification_result' => $isValidPassword ? 'senha correta' : 'senha incorreta'
            ];

            // Criar novo hash para comparação
            $newHash = password_hash($password, PASSWORD_DEFAULT);
            $result['hash_comparison'] = [
                'stored_hash' => $user['password'],
                'new_test_hash' => $newHash,
                'verify_new_hash' => password_verify($password, $newHash)
            ];
        } else {
            $result['test_user'] = [
                'found' => false,
                'message' => 'Usuário master não encontrado'
            ];
        }

        // Passo 4: Listar todos os usuários (limitado a 5)
        $stmt = $db->query("SELECT id, name, email, role FROM User LIMIT 5");
        $result['all_users'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($result, JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}