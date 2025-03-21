<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/html; charset=utf-8');

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Criar um registro de teste
    $testId = 'test_' . time();
    
    // Inserir dados
    $insertSql = "INSERT INTO ExcelData (id, item, cliente, corretor, teamId, data, createdAt, updatedAt) 
                  VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())";
    
    $stmt = $db->prepare($insertSql);
    $stmt->execute([
        $testId,
        '1',
        'Cliente de Teste ' . date('H:i:s'),
        'Corretor Teste',
        'team_1'
    ]);
    
    // Verificar se foi salvo
    $selectSql = "SELECT * FROM ExcelData WHERE id = ?";
    $stmt = $db->prepare($selectSql);
    $stmt->execute([$testId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "<div style='font-family: Arial; padding: 20px;'>";
    
    if ($result) {
        echo "<div style='background: #e8f5e9; padding: 15px; border-radius: 4px; margin: 10px 0;'>";
        echo "<h3 style='color: #28a745;'>✓ Registro salvo com sucesso!</h3>";
        echo "<p><strong>ID:</strong> " . htmlspecialchars($result['id']) . "</p>";
        echo "<p><strong>Cliente:</strong> " . htmlspecialchars($result['cliente']) . "</p>";
        echo "<p><strong>Corretor:</strong> " . htmlspecialchars($result['corretor']) . "</p>";
        echo "</div>";
        
        echo "<div style='margin-top: 20px;'>";
        echo "<p><strong>Para testar a persistência:</strong></p>";
        echo "<p>1. <a href='check_record.php?id=" . urlencode($testId) . "' style='color: #007bff;'>Clique aqui para verificar o registro</a></p>";
        echo "<p>2. Ou atualize esta página (F5) para ver se os dados continuam</p>";
        echo "</div>";
    } else {
        echo "<div style='background: #ffebee; padding: 15px; border-radius: 4px; margin: 10px 0;'>";
        echo "<h3 style='color: #dc3545;'>❌ Erro: Registro não encontrado após inserção</h3>";
        echo "</div>";
    }
    
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div style='background: #ffebee; padding: 15px; border-radius: 4px; margin: 10px 0;'>";
    echo "<h3 style='color: #dc3545;'>❌ Erro:</h3>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
    echo "</div>";
}
?>