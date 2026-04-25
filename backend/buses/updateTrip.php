<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
  echo json_encode(["success" => false]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset(
  $data['trip_id'],
  $data['route_id'],
  $data['trip_type'],
  $data['trip_time']
)) {
  echo json_encode(["success" => false, "message" => "Invalid data"]);
  exit;
}

$stmt = $conn->prepare(
  "UPDATE trips SET route_id = ?, trip_type = ?, trip_time = ? WHERE trip_id = ?"
);

$stmt->bind_param(
  "issi",
  $data['route_id'],
  $data['trip_type'],
  $data['trip_time'],
  $data['trip_id']
);

echo json_encode(["success" => $stmt->execute()]);
