<?php
require_once '../config/database.php';
require_once 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    $query = 'SELECT corretor, parceriaGestor, teamId FROM ExcelData';
    $params = [];

    // Filtrar por teamId se especificado
    if (isset($_GET['teamId'])) {
        $query .= ' WHERE teamId = ?';
        $params[] = $_GET['teamId'];
    }

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Criar nova planilha
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    // Adicionar cabeçalhos
    $sheet->setCellValue('A1', 'Corretor');
    $sheet->setCellValue('B1', 'Parceria Gestor');
    $sheet->setCellValue('C1', 'Team ID');

    // Adicionar dados
    $row = 2;
    foreach ($data as $item) {
        $sheet->setCellValue('A' . $row, $item['corretor']);
        $sheet->setCellValue('B' . $row, $item['parceriaGestor']);
        $sheet->setCellValue('C' . $row, $item['teamId']);
        $row++;
    }

    // Configurar cabeçalhos HTTP para download
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="dados_exportados.xlsx"');
    header('Cache-Control: max-age=0');

    // Criar arquivo Excel
    $writer = new Xlsx($spreadsheet);
    $writer->save('php://output');
    exit();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao exportar dados: ' . $e->getMessage()]);
}
?> 