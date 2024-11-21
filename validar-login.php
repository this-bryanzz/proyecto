<?php
// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de conexión a la base de datos
$host = "localhost";
$usuario = "root";
$contraseña = "";
$baseDatos = "paginaweb";
$puerto = 3306;

// Conectar a la base de datos
$conn = new mysqli($host, $usuario, $contraseña, $baseDatos, $puerto);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos: " . $conn->connect_error]));
}

// Leer y decodificar los datos JSON recibidos
$input = json_decode(file_get_contents("php://input"), true);

$correo = $input['correo'] ?? null;
$contraseña = $input['contraseña'] ?? null;

// Validar datos
if (!$correo || !$contraseña) {
    echo json_encode(["success" => false, "message" => "Correo y contraseña son obligatorios"]);
    exit;
}

// Preparar y ejecutar la consulta para buscar el usuario
$stmt = $conn->prepare("SELECT password FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();
    // Comparar la contraseña ingresada con la almacenada (en producción usar password_verify)
    if ($contraseña === $usuario['password']) {
        echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso"]);
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
}

// Cerrar conexión
$stmt->close();
$conn->close();
?>
