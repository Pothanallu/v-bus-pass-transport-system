<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

/* =========================
   GET BUS ID
========================= */
$bus_id = $_GET["bus_id"] ?? 0;

if (!$bus_id) {
    echo json_encode([
        "success" => false,
        "message" => "Bus ID is required"
    ]);
    exit;
}

/* =========================
   FETCH INSURANCE
========================= */
$stmt = $conn->prepare("
    SELECT 
        insurance_company,
        policy_number,
        start_date,
        expiry_date
    FROM bus_insurance
    WHERE bus_id = ?
    LIMIT 1
");

$stmt->bind_param("i", $bus_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => true,
        "data" => $result->fetch_assoc()
    ]);
} else {
    // No insurance yet (ADD mode)
    echo json_encode([
        "success" => true,
        "data" => null
    ]);
}

$conn->close();
