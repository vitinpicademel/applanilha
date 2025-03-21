<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Nova senha para o usuário master
    $newPassword = 'admin123';
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Atualizar a senha do usuário master
    $stmt = $db->prepare('UPDATE User SET password = ? WHERE email = ?');
    $result = $stmt->execute([$hashedPassword, 'admin@donnanegociacoes.com.br']);
    
    if ($result) {
        // Verificar se a senha foi atualizada corretamente
        $stmt = $db->prepare('SELECT * FROM User WHERE email = ?');
        $stmt->execute(['admin@donnanegociacoes.com.br']);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Testar a nova senha
        $isValid = password_verify($newPassword, $user['password']);
        
        echo json_encode([
            'success' => true,
            'message' => 'Senha do usuário master atualizada com sucesso',
            'password_test' => [
                'is_valid' => $isValid,
                'new_password' => $newPassword
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao atualizar a senha'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
}