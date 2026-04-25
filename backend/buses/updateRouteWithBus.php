<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB error"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (
  !isset(
    $data['route_id'],
    $data['route_areas'],
    $data['destination'],
    $data['bus_id'],
    $data['bus_city'],
    $data['boarding_point']
  )
) {
  echo json_encode(["success" => false, "message" => "Invalid data"]);
  exit;
}

$conn->begin_transaction();

try {
  $stmt1 = $conn->prepare(
    "UPDATE routes SET route_areas = ?, destination = ? WHERE route_id = ?"
  );
  $stmt1->bind_param(
    "ssi",
    $data['route_areas'],
    $data['destination'],
    $data['route_id']
  );
  $stmt1->execute();

  $stmt2 = $conn->prepare(
    "UPDATE buses SET city = ?, route = ? WHERE bus_id = ?"
  );
  $stmt2->bind_param(
    "ssi",
    $data['bus_city'],
    $data['boarding_point'],
    $data['bus_id']
  );
  $stmt2->execute();

  $conn->commit();
  echo json_encode(["success" => true]);

} catch (Exception $e) {
  $conn->rollback();
  echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
