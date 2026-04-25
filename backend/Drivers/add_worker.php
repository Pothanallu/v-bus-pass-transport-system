<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$role = $data['role'] ?? '';
$phone = $data['phone'] ?? '';
$status = $data['status'] ?? 'Available';

if (!$name || !$role || !$phone) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

/* 🔥 Column order matches table exactly */
$stmt = $conn->prepare("
    INSERT INTO workers (name, role, phone, status)
    VALUES (?, ?, ?, ?)
");

if (!$stmt) {
    echo json_encode(["success" => false, "message" => $conn->error]);
    exit;
}

$stmt->bind_param("ssss", $name, $role, $phone, $status);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>