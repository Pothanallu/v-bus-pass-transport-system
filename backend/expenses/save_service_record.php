<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

/* =========================
   VALIDATION
========================= */
$bus_id = $data["bus_id"] ?? null;
$service_type = trim($data["service_type"] ?? "");
$service_date = $data["service_date"] ?? "";
$next_due = $data["next_service_due"] ?? "";
$service_center = trim($data["service_center"] ?? "");
$cost = $data["cost"] ?? "";
$remarks = trim($data["remarks"] ?? "");

if (!$bus_id || !$service_type || !$service_date || !$cost) {
    echo json_encode([
        "success" => false,
        "message" => "Required fields missing"
    ]);
    exit;
}

/* =========================
   INSERT RECORD
========================= */

$stmt = $conn->prepare("
    INSERT INTO service_records
    (bus_id, service_type, service_date, next_service_due, service_center, cost, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "issssds",
    $bus_id,
    $service_type,
    $service_date,
    $next_due,
    $service_center,
    $cost,
    $remarks
);

$stmt->execute();

echo json_encode([
    "success" => true,
    "message" => "Service record added successfully"
]);

$conn->close();