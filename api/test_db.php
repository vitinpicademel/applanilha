<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    echo "Conexão com o banco de dados estabelecida com sucesso!";
} catch (Exception $e) {
    echo "Erro ao conectar com o banco de dados: " . $e->getMessage();
} 