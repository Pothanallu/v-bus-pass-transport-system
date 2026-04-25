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

$reg_no = $_GET['reg_no'] ?? '';

if ($reg_no === '') {
    echo json_encode([
        "success" => false,
        "message" => "Registration number required"
    ]);
    exit;
}

$stmt = $conn->prepare("
    SELECT *
    FROM bus_passes
    WHERE reg_no = ?
    ORDER BY pass_id DESC
    LIMIT 1
");

$stmt->bind_param("s", $reg_no);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "No pass found"
    ]);
    exit;
}

$data = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "data" => $data
]);