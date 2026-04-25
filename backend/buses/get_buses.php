<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

/* =========================
   GET ALL BUSES + FITNESS
========================= */

$sql = "
SELECT 
    b.bus_id,
    b.bus_number,
    b.seating_capacity,
    b.bus_model,
    b.city,
    b.route,
    b.operational_status,
    f.fitness_expiry_date
FROM buses b
LEFT JOIN bus_inspection f ON b.bus_id = f.bus_id
ORDER BY b.bus_number
";

$res = $conn->query($sql);

$buses = [];
$total = 0;
$active = 0;
$maintenance = 0;
$inactive = 0;

$today = date('Y-m-d');

while ($row = $res->fetch_assoc()) {

    // FITNESS STATUS LOGIC
    if ($row['fitness_expiry_date'] && $row['fitness_expiry_date'] >= $today) {
        $row['fitness_status'] = 'VALID';
    } else {
        $row['fitness_status'] = 'EXPIRED';
    }

    $buses[] = $row;
    $total++;

    if ($row['operational_status'] === 'Active') {
        $active++;
    } elseif ($row['operational_status'] === 'Under Maintenance') {
        $maintenance++;
    } elseif ($row['operational_status'] === 'Not in Service') {
        $inactive++;
    }
}

echo json_encode([
    "success" => true,
    "data" => $buses,
    "counts" => [
        "total" => $total,
        "active" => $active,
        "maintenance" => $maintenance,
        "inactive" => $inactive
    ]
]);
