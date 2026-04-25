<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false]);
    exit;
}

$bus_id = $_GET["bus_id"] ?? null;

if (!$bus_id) {
    echo json_encode(["success" => false]);
    exit;
}

$stmt = $conn->prepare("
    SELECT * FROM service_records
    WHERE bus_id = ?
    ORDER BY service_date DESC
");

$stmt->bind_param("i", $bus_id);
$stmt->execute();

$result = $stmt->get_result();

$records = [];

while ($row = $result->fetch_assoc()) {
    $records[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $records
]);

$conn->close();