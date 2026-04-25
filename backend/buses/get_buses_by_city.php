<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false]);
    exit;
}

$city = $_GET['city'] ?? '';
if ($city === '') {
    echo json_encode(["success" => false, "data" => []]);
    exit;
}

$stmt = $conn->prepare("
    SELECT bus_number, route
    FROM buses
    WHERE city = ? AND operational_status = 'Active'
");
$stmt->bind_param("s", $city);
$stmt->execute();

$res = $stmt->get_result();
$buses = [];

while ($row = $res->fetch_assoc()) {
    $buses[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $buses
]);
