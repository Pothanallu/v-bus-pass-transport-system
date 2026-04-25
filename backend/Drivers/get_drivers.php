<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "DB connection failed"
    ]);
    exit;
}

/* =========================
   GET ALL DRIVERS
========================= */

$sql = "
SELECT 
    driver_id,
    name,
    phone,
    license_no,
    license_expiry_date,
    status
FROM drivers
ORDER BY name
";

$res = $conn->query($sql);

$drivers = [];
$total = 0;
$available = 0;
$assigned = 0;
$inactive = 0;

$today = date('Y-m-d');

while ($row = $res->fetch_assoc()) {

    // LICENSE STATUS LOGIC
    if ($row['license_expiry_date'] && $row['license_expiry_date'] >= $today) {
        $row['license_status'] = 'VALID';
    } else {
        $row['license_status'] = 'EXPIRED';
    }

    $drivers[] = $row;
    $total++;

    if ($row['status'] === 'Available') {
        $available++;
    } elseif ($row['status'] === 'Assigned') {
        $assigned++;
    } elseif ($row['status'] === 'Inactive') {
        $inactive++;
    }
}

echo json_encode([
    "success" => true,
    "data" => $drivers,
    "counts" => [
        "total" => $total,
        "available" => $available,
        "assigned" => $assigned,
        "inactive" => $inactive
    ]
]);

$conn->close();
?>