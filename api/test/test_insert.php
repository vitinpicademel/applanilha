<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception("Conexão com o banco de dados falhou");
    }

    // Tentar inserir um registro de teste
    $testId = 'test_' . time();
    
    // Primeiro, verificar se podemos fazer INSERT
    $insertSql = "INSERT INTO ExcelData (id, item, cliente) VALUES (?, ?, ?)";
    $stmt = $db->prepare($insertSql);
    $stmt->execute([$testId, '1', 'Cliente Teste']);
    
    // Verificar se o registro foi inserido
    $selectSql = "SELECT * FROM ExcelData WHERE id = ?";
    $stmt = $db->prepare($selectSql);
    $stmt->execute([$testId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$result) {
        throw new Exception("Registro não foi encontrado após inserção");
    }
    
    // Tentar atualizar o registro
    $updateSql = "UPDATE ExcelData SET cliente = ? WHERE id = ?";
    $stmt = $db->prepare($updateSql);
    $stmt->execute(['Cliente Teste Atualizado', $testId]);
    
    // Verificar se a atualização funcionou
    $stmt = $db->prepare($selectSql);
    $stmt->execute([$testId]);
    $updatedResult = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Verificar permissões do usuário do banco
    $stmt = $db->query("SHOW GRANTS");
    $grants = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Verificar o engine da tabela
    $stmt = $db->query("SHOW TABLE STATUS WHERE Name = 'ExcelData'");
    $tableInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Teste de banco de dados completo',
        'insert_success' => true,
        'update_success' => ($updatedResult['cliente'] === 'Cliente Teste Atualizado'),
        'table_engine' => $tableInfo['Engine'],
        'grants' => $grants,
        'connection_info' => [
            'host' => $database->host ?? 'não disponível',
            'database' => $database->database ?? 'não disponível'
        ]
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'error_type' => get_class($e),
        'error_trace' => $e->getTraceAsString()
    ]);
}
?>