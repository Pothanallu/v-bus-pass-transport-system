<?php
/* =========================
   HEADERS (CORS SAFE)
========================= */
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

/* Handle preflight request */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

/* =========================
   DB CONNECTION
========================= */
$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
  echo json_encode([
    "success" => false,
    "message" => "Database connection failed"
  ]);
  exit;
}

/* =========================
   READ INPUT
========================= */
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['bus_id']) || empty($data['bus_id'])) {
  echo json_encode([
    "success" => false,
    "message" => "Bus ID required"
  ]);
  exit;
}

$bus_id = (int)$data['bus_id'];

/* =========================
   FETCH TRIPS FOR BUS
========================= */
$sql = "
SELECT 
  t.trip_id,
  t.trip_type,
  t.trip_time,
  r.route_number
FROM trips t
JOIN routes r ON t.route_id = r.route_id
WHERE t.bus_id = ?
ORDER BY 
  FIELD(t.trip_type, 'Morning', 'Evening'),
  t.trip_time
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $bus_id);
$stmt->execute();
$result = $stmt->get_result();

/* =========================
   BUILD RESPONSE
========================= */
$trips = [];
while ($row = $result->fetch_assoc()) {
  $trips[] = $row;
}

echo json_encode([
  "success" => true,
  "data" => $trips
]);
