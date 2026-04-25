<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost","root","","transport_db");

$data = json_decode(file_get_contents("php://input"), true);
$bus_number = $data['bus_number'] ?? '';

if(!$bus_number){
    echo json_encode(["assigned"=>false]);
    exit;
}

$query = "
SELECT d.name AS driver_name
FROM buses b
LEFT JOIN bus_assignments ba 
    ON b.bus_id = ba.bus_id AND ba.status = 'Active'
LEFT JOIN drivers d 
    ON ba.driver_id = d.driver_id
WHERE b.bus_number = ?
";

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $bus_number);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row && $row['driver_name']) {
    echo json_encode([
        "assigned" => true,
        "driver" => $row['driver_name']
    ]);
} else {
    echo json_encode([
        "assigned" => false
    ]);
}

$conn->close();
?>