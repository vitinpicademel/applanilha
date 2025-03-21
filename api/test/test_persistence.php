<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Gerar ID único para teste
    $testId = 'persist_test_' . time();
    
    // Inserir dados
    $insertSql = "INSERT INTO ExcelData (id, item, cliente, data) VALUES (?, ?, ?, NOW())";
    $stmt = $db->prepare($insertSql);
    $stmt->execute([$testId, '1', 'Teste de Persistência']);
    
    // Forçar commit
    $db->commit();
    
    // Fechar e reabrir conexão para simular nova requisição
    $db = null;
    $database = new Database();
    $db = $database->getConnection();
    
    // Verificar se os dados ainda existem
    $selectSql = "SELECT * FROM ExcelData WHERE id = ?";
    $stmt = $db->prepare($selectSql);
    $stmt->execute([$testId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$result) {
        throw new Exception("Dados não persistiram após reconexão");
    }
    
    // Tentar atualizar
    $updateSql = "UPDATE ExcelData SET cliente = ? WHERE id = ?";
    $stmt = $db->prepare($updateSql);
    $stmt->execute(['Persistência Confirmada', $testId]);
    
    // Forçar commit novamente
    $db->commit();
    
    // Fechar e reabrir conexão mais uma vez
    $db = null;
    $database = new Database();
    $db = $database->getConnection();
    
    // Verificar novamente
    $stmt = $db->prepare($selectSql);
    $stmt->execute([$testId]);
    $finalResult = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Teste de persistência completo',
        'initial_insert' => true,
        'data_persisted' => ($result !== false),
        'update_persisted' => ($finalResult['cliente'] === 'Persistência Confirmada'),
        'test_id' => $testId,
        'final_data' => $finalResult
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'error_type' => get_class($e)
    ]);
}
?>