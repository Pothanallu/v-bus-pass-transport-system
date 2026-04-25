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

/* =====================================================
   IMPORTANT: Include driver_id and worker_id
===================================================== */

$sql = "
SELECT 
    ba.assignment_id,
    b.bus_number,
    ba.driver_id,
    d.name AS driver_name,
    ba.worker_id,
    w.name AS worker_name,
    ba.status
FROM bus_assignments ba
JOIN buses b ON ba.bus_id = b.bus_id
JOIN drivers d ON ba.driver_id = d.driver_id
LEFT JOIN workers w ON ba.worker_id = w.worker_id
ORDER BY ba.assignment_id DESC
";

$result = $conn->query($sql);

$data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Query failed"
    ]);
}

$conn->close();
?>