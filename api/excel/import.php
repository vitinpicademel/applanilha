<?php
require_once '../config/database.php';
require_once 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit();
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nenhum arquivo enviado']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    $inputFileName = $_FILES['file']['tmp_name'];
    $spreadsheet = IOFactory::load($inputFileName);
    $worksheet = $spreadsheet->getActiveSheet();
    $rows = $worksheet->toArray();

    // Remover cabeçalho
    array_shift($rows);

    $stmt = $db->prepare('
        INSERT INTO ExcelData (
            id, 
            item,
            data,
            cliente,
            cpf,
            corretor,
            parceriaCorretores,
            parceriaGestores,
            origemLead,
            incorporadora,
            tipoImovel,
            informacaoImovel,
            vgv,
            formaPagamento,
            aprovacao,
            obs,
            situacao,
            comissaoPrevista,
            vgcPrevista,
            vgcReal,
            captador,
            nomeCaptador,
            comissaoReal,
            comissaoGestor,
            teamId,
            createdAt, 
            updatedAt
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, NOW(), NOW()
        )
    ');

    $importedCount = 0;
    foreach ($rows as $row) {
        if (!empty($row[0])) { // Verifica se a linha não está vazia
            $id = uniqid('exc_', true);
            
            // Mapear os campos da planilha
            $values = [
                $id,                    // id
                $row[0] ?? '',         // item
                $row[1] ?? '',         // data
                $row[2] ?? '',         // cliente
                $row[3] ?? '',         // cpf
                $row[4] ?? '',         // corretor
                $row[5] ?? '',         // parceriaCorretores
                $row[6] ?? '',         // parceriaGestores
                $row[7] ?? '',         // origemLead
                $row[8] ?? '',         // incorporadora
                $row[9] ?? '',         // tipoImovel
                $row[10] ?? '',        // informacaoImovel
                $row[11] ?? '',        // vgv
                $row[12] ?? '',        // formaPagamento
                $row[13] ?? '',        // aprovacao
                $row[14] ?? '',        // obs
                $row[15] ?? '',        // situacao
                $row[16] ?? '',        // comissaoPrevista
                $row[17] ?? '',        // vgcPrevista
                $row[18] ?? '',        // vgcReal
                $row[19] ?? '',        // captador
                $row[20] ?? '',        // nomeCaptador
                $row[21] ?? '',        // comissaoReal
                $row[22] ?? '',        // comissaoGestor
                $row[6] ?? null        // teamId (usando o mesmo valor de parceriaGestores)
            ];

            $stmt->execute($values);
            $importedCount++;
        }
    }

    echo json_encode([
        'success' => true,
        'message' => "Importação concluída com sucesso. $importedCount registros importados."
    ]);

} catch (Exception $e) {
    error_log("Erro na importação: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao importar arquivo: ' . $e->getMessage()]);
}
?>