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
$bus_number = strtoupper(trim($data['bus_number'] ?? ''));

if ($bus_number === '') {
    echo json_encode([
        "success" => false,
        "message" => "Bus number is required"
    ]);
    exit;
}

/* =========================
   1️⃣ FETCH BUS
========================= */
$stmt = $conn->prepare(
    "SELECT * FROM buses WHERE UPPER(bus_number) = ? LIMIT 1"
);
$stmt->bind_param("s", $bus_number);
$stmt->execute();

$bus = $stmt->get_result()->fetch_assoc();

if (!$bus) {
    echo json_encode([
        "success" => false,
        "message" => "Bus not found"
    ]);
    exit;
}

/* =========================
   2️⃣ FETCH LATEST INSPECTION
========================= */
$stmt = $conn->prepare(
    "SELECT *
     FROM bus_inspection
     WHERE bus_id = ?
     ORDER BY inspection_date DESC
     LIMIT 1"
);
$stmt->bind_param("i", $bus['bus_id']);
$stmt->execute();

$inspection = $stmt->get_result()->fetch_assoc();

/* =========================
   RESPONSE
========================= */
echo json_encode([
    "success" => true,
    "bus" => $bus,
    "inspection" => $inspection
]);
