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
  echo json_encode(["success" => false]);
  exit;
}

$sql = "
SELECT 
  r.route_id,
  r.route_number,
  r.route_areas,
  r.destination,
  r.bus_id,
  b.bus_number,
  b.city AS bus_city,
  b.route AS boarding_point
FROM routes r
JOIN buses b ON r.bus_id = b.bus_id
ORDER BY r.route_number
";

$res = $conn->query($sql);
$data = [];

while ($row = $res->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode([
  "success" => true,
  "data" => $data
]);
