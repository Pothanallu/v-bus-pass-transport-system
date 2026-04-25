<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "transport_db");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['worker_id'], $data['name'], $data['status'])) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

$worker_id = intval($data['worker_id']);
$name = $data['name'];
$status = $data['status'];

$stmt = $conn->prepare("
    UPDATE workers 
    SET name = ?, status = ? 
    WHERE worker_id = ?
");

$stmt->bind_param("ssi", $name, $status, $worker_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}

$stmt->close();
$conn->close();
?>