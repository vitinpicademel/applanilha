<?php
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

class Database {
    private $host = "localhost";
    private $database = "controledevendas";
    private $username = "root";
    private $password = "";
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database,
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_AUTOCOMMIT => true,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
                )
            );
            
            $this->conn->exec("SET SESSION sql_mode = 'STRICT_ALL_TABLES'");
            
            if (!$this->conn->query("SELECT 1")) {
                throw new PDOException("Conex���o perdida com o banco de dados");
            }
            
        } catch(PDOException $e) {
            error_log("Erro na conex���o com o banco: " . $e->getMessage());
            echo json_encode(array(
                "error" => true,
                "message" => "Erro na conex���o: " . $e->getMessage(),
                "details" => array(
                    "host" => $this->host,
                    "database" => $this->database,
                    "username" => $this->username
                )
            ));
            exit();
        }

        return $this->conn;
    }
}
?>