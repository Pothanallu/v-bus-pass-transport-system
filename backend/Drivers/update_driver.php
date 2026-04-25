<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

// Read raw JSON input
$rawData = file_get_contents("php://input");

if (!$rawData) {
    echo json_encode([
        "success" => false,
        "message" => "No JSON received"
    ]);
    exit;
}

$data = json_decode($rawData, true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON format"
    ]);
    exit;
}

// Extract fields
$driver_id = $data['driver_id'] ?? null;
$name      = $data['name'] ?? null;
$phone     = $data['phone'] ?? null;
$status    = $data['status'] ?? null;

// Validate required fields
if (!$driver_id || !$name || !$status) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

// Prepare update query
$stmt = $conn->prepare(
    "UPDATE drivers SET name = ?, phone = ?, status = ? WHERE driver_id = ?"
);

$stmt->bind_param("sssi", $name, $phone, $status, $driver_id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Driver updated successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>