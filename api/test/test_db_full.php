<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';

try {
    $result = [
        'tests' => [],
        'database_info' => [],
        'tables' => []
    ];

    // Teste 1: Conexão com o banco
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception("Falha na conexão com o banco de dados");
    }
    
    $result['tests'][] = [
        'name' => 'Conexão com o banco',
        'status' => 'success'
    ];

    // Teste 2: Informações do banco
    $result['database_info'] = [
        'host' => $db->getAttribute(PDO::ATTR_CONNECTION_STATUS),
        'server_version' => $db->getAttribute(PDO::ATTR_SERVER_VERSION),
        'client_version' => $db->getAttribute(PDO::ATTR_CLIENT_VERSION)
    ];

    // Teste 3: Listar todas as tabelas
    $stmt = $db->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    foreach ($tables as $table) {
        $count = $db->query("SELECT COUNT(*) FROM $table")->fetchColumn();
        $recent = $db->query("SELECT * FROM $table ORDER BY id DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
        
        $result['tables'][] = [
            'name' => $table,
            'record_count' => $count,
            'recent_records' => $recent
        ];
    }

    // Teste 4: Teste de escrita
    $test_table = "test_connection_" . time();
    $db->exec("CREATE TEMPORARY TABLE IF NOT EXISTS $test_table (id INT AUTO_INCREMENT PRIMARY KEY, test_data VARCHAR(255))");
    $db->exec("INSERT INTO $test_table (test_data) VALUES ('test_" . time() . "')");
    $write_test = $db->query("SELECT * FROM $test_table")->fetch(PDO::FETCH_ASSOC);
    
    $result['tests'][] = [
        'name' => 'Teste de escrita',
        'status' => 'success',
        'data' => $write_test
    ];

    echo json_encode($result, JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ]);
}
?>