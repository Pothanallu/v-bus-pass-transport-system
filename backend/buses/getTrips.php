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
  t.trip_id,
  t.trip_type,
  t.trip_time,
  r.route_id,
  r.route_number,
  b.bus_id,
  b.bus_number,
  b.city AS bus_city,
  b.route AS boarding_point
FROM trips t
JOIN routes r ON t.route_id = r.route_id
JOIN buses b ON t.bus_id = b.bus_id
ORDER BY b.bus_number, t.trip_type
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
