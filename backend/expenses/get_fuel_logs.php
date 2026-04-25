<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

$bus_id = $_GET["bus_id"] ?? null;

if (!$bus_id) {
    echo json_encode([
        "success" => false,
        "message" => "Bus ID is required"
    ]);
    exit;
}

/* =========================
   GET LOGS
========================= */

$stmt = $conn->prepare("
    SELECT fuel_id, fuel_date, liters, cost, 
           odometer_reading, mileage, created_at
    FROM fuel_logs
    WHERE bus_id = ?
    ORDER BY fuel_date DESC
");

$stmt->bind_param("i", $bus_id);
$stmt->execute();
$result = $stmt->get_result();

$logs = [];
$totalFuel = 0;
$totalCost = 0;
$totalDistance = 0;
$avgMileage = 0;
$count = 0;

while ($row = $result->fetch_assoc()) {
    $logs[] = $row;

    $totalFuel += $row["liters"];
    $totalCost += $row["cost"];
    $totalDistance += ($row["mileage"] * $row["liters"]);
    $count++;
}

if ($totalFuel > 0) {
    $avgMileage = round($totalDistance / $totalFuel, 2);
}

echo json_encode([
    "success" => true,
    "data" => $logs,
    "summary" => [
        "total_entries" => $count,
        "total_fuel" => $totalFuel,
        "total_cost" => $totalCost,
        "average_mileage" => $avgMileage
    ]
]);

$conn->close();