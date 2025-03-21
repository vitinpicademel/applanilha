<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Teste 1: Iniciando teste de login...<br>";

try {
    require_once 'config/database.php';
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        $email = 'admin@donnanegociacoes.com.br';
        $password = 'password';
        
        $stmt = $conn->prepare("SELECT * FROM User WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo "<br>Usuário encontrado:<br>";
            echo "ID: " . $user['id'] . "<br>";
            echo "Nome: " . $user['name'] . "<br>";
            echo "Email: " . $user['email'] . "<br>";
            echo "Role: " . $user['role'] . "<br>";
            echo "Senha hash: " . $user['password'] . "<br>";
            
            if (password_verify($password, $user['password'])) {
                echo "<br>Senha está correta!<br>";
            } else {
                echo "<br>Senha está incorreta!<br>";
            }
        } else {
            echo "<br>Usuário não encontrado<br>";
        }
    }
} catch (PDOException $e) {
    echo "Erro PDO: " . $e->getMessage() . "<br>";
} catch (Exception $e) {
    echo "Erro geral: " . $e->getMessage() . "<br>";
}
?>