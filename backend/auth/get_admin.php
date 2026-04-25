<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$admin_id = $data['admin_id'] ?? 0;

if ($admin_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Admin ID required"
    ]);
    exit;
}

/* =========================
   GET ADMIN DETAILS
========================= */
$stmt = $conn->prepare(
    "SELECT admin_id, name, email, phone, role, username
     FROM transport_admins
     WHERE admin_id = ?"
);
$stmt->bind_param("i", $admin_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Admin not found"
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "data" => $result->fetch_assoc()
]);
