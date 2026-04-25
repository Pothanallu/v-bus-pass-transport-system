<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed",
        "error" => $conn->connect_error
    ]);
    exit;
}

$sql = "SELECT worker_id, name, role, phone, status FROM workers ORDER BY name";

$res = $conn->query($sql);

if (!$res) {
    echo json_encode([
        "success" => false,
        "message" => "Query failed",
        "error" => $conn->error
    ]);
    exit;
}

$workers = [];
$total = 0;
$available = 0;
$assigned = 0;
$inactive = 0;

while ($row = $res->fetch_assoc()) {
    $workers[] = $row;
    $total++;

    if ($row['status'] === 'Available') $available++;
    elseif ($row['status'] === 'Assigned') $assigned++;
    elseif ($row['status'] === 'Inactive') $inactive++;
}

echo json_encode([
    "success" => true,
    "data" => $workers,
    "counts" => [
        "total" => $total,
        "available" => $available,
        "assigned" => $assigned,
        "inactive" => $inactive
    ]
]);

$conn->close();
?>