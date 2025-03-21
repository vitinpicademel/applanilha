<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== TESTE DE CONEXÃO COM O BANCO ===\n\n";

// 1. Verificar se o PHP está funcionando
echo "1. PHP está funcionando\n\n";

// 2. Verificar se consegue carregar o arquivo de configuração
echo "2. Tentando carregar arquivo de configuração...\n";
require_once '../config/database.php';
echo "   ✓ Arquivo de configuração carregado\n\n";

// 3. Tentar conectar ao banco
echo "3. Tentando conectar ao banco...\n";
try {
    $database = new Database();
    $db = $database->getConnection();
    echo "   ✓ Conexão estabelecida\n\n";
    
    // 4. Testar se consegue executar uma query simples
    echo "4. Testando query simples...\n";
    $result = $db->query("SELECT 1")->fetch();
    echo "   ✓ Query simples funcionou\n\n";
    
    // 5. Verificar a estrutura da tabela
    echo "5. Verificando estrutura da tabela ExcelData...\n";
    $result = $db->query("DESCRIBE ExcelData")->fetchAll(PDO::FETCH_ASSOC);
    echo "   Colunas encontradas:\n";
    foreach ($result as $column) {
        echo "   - " . $column['Field'] . " (" . $column['Type'] . ")\n";
    }
    echo "\n";
    
    // 6. Tentar inserir um registro de teste
    echo "6. Tentando inserir registro de teste...\n";
    $testId = 'debug_' . time();
    $stmt = $db->prepare("INSERT INTO ExcelData (id, item, cliente, corretor, teamId) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$testId, '1', 'Cliente Teste', 'Corretor Teste', 'team_1']);
    echo "   ✓ Registro inserido\n\n";
    
    // 7. Verificar se o registro foi salvo
    echo "7. Verificando se o registro foi salvo...\n";
    $stmt = $db->prepare("SELECT * FROM ExcelData WHERE id = ?");
    $stmt->execute([$testId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        echo "   ✓ Registro encontrado no banco\n";
        echo "   ID: " . $result['id'] . "\n";
        echo "   Cliente: " . $result['cliente'] . "\n";
        echo "   Corretor: " . $result['corretor'] . "\n";
    } else {
        echo "   ✕ Registro não encontrado!\n";
    }
    
    // 8. Verificar configurações do banco
    echo "\n8. Configurações do banco:\n";
    $variables = $db->query("SHOW VARIABLES LIKE '%autocommit%'")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($variables as $var) {
        echo "   " . $var['Variable_name'] . " = " . $var['Value'] . "\n";
    }
    
} catch (Exception $e) {
    echo "   ✕ ERRO: " . $e->getMessage() . "\n";
    echo "   Arquivo: " . $e->getFile() . "\n";
    echo "   Linha: " . $e->getLine() . "\n";
}

echo "\n=== FIM DO TESTE ===\n";
?>