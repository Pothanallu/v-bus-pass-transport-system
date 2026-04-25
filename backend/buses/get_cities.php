<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false]);
    exit;
}

$sql = "SELECT DISTINCT city FROM buses WHERE city IS NOT NULL ORDER BY city";
$res = $conn->query($sql);

$cities = [];
while ($row = $res->fetch_assoc()) {
    $cities[] = $row['city'];
}

echo json_encode([
    "success" => true,
    "data" => $cities
]);
