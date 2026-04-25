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
$phone = $data['phone'] ?? '';
$license_no = $data['license_no'] ?? '';
$expiry = $data['expiry'] ?? '';
$status = $data['status'] ?? '';

if (!$name || !$phone || !$license_no || !$expiry) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO drivers 
    (name, phone, license_no, license_expiry_date, status) 
    VALUES (?, ?, ?, ?, ?)
");

if (!$stmt) {
    echo json_encode(["success" => false, "message" => $conn->error]);
    exit;
}

$stmt->bind_param("sssss", $name, $phone, $license_no, $expiry, $status);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>