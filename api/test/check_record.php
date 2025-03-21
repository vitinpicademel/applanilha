<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/html; charset=utf-8');

require_once '../config/database.php';

try {
    if (!isset($_GET['id'])) {
        throw new Exception("Por favor, forneça um ID para verificar");
    }
    
    $testId = $_GET['id'];
    $database = new Database();
    $db = $database->getConnection();
    
    $stmt = $db->prepare("SELECT * FROM ExcelData WHERE id = ?");
    $stmt->execute([$testId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "<div style='font-family: Arial; padding: 20px;'>";
    
    if ($result) {
        echo "<div style='background: #e8f5e9; padding: 15px; border-radius: 4px;'>";
        echo "<h3 style='color: #28a745; margin-top: 0;'>✓ Registro encontrado!</h3>";
        echo "<p><strong>ID:</strong> " . htmlspecialchars($result['id']) . "</p>";
        echo "<p><strong>Cliente:</strong> " . htmlspecialchars($result['cliente']) . "</p>";
        echo "<p><strong>Corretor:</strong> " . htmlspecialchars($result['corretor']) . "</p>";
        echo "<p><strong>Data de Criação:</strong> " . htmlspecialchars($result['createdAt']) . "</p>";
        echo "</div>";
    } else {
        echo "<div style='background: #ffebee; padding: 15px; border-radius: 4px;'>";
        echo "<h3 style='color: #dc3545; margin-top: 0;'>❌ Registro não encontrado</h3>";
        echo "<p>ID procurado: " . htmlspecialchars($testId) . "</p>";
        echo "</div>";
    }
    
    echo "<p style='margin-top: 20px;'><a href='test_save.php' style='color: #007bff;'>← Voltar para o teste</a></p>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div style='background: #ffebee; padding: 15px; border-radius: 4px;'>";
    echo "<h3 style='color: #dc3545; margin-top: 0;'>❌ Erro:</h3>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
    echo "</div>";
}
?>