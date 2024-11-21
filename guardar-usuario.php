<?php
// Habilitar CORS
header("Access-Control-Allow-Origin: *"); // Permitir cualquier origen (puedes especificar un origen específico si lo deseas)
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos
header("Content-Type: application/json"); // Respuesta en formato JSON

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

$nombre = $input['nombre'] ?? null;
$correo = $input['correo'] ?? null;
$contraseña = $input['contraseña'] ?? null;

// Validar datos
if (!$nombre || !$correo || !$contraseña) {
    echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios"]);
    exit;
}

// Preparar y ejecutar la consulta
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $nombre, $correo, $contraseña);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al insertar el usuario: " . $stmt->error]);
}

// Cerrar conexión
$stmt->close();
$conn->close();
?>
