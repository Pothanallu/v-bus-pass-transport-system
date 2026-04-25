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
   FETCH ROUTES FOR BUS
========================= */
$sql = "
SELECT 
  r.route_id,
  r.route_number,
  r.route_areas,
  r.destination
FROM routes r
WHERE r.bus_id = ?
ORDER BY r.route_number
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $bus_id);
$stmt->execute();
$result = $stmt->get_result();

/* =========================
   BUILD RESPONSE
========================= */
$routes = [];
while ($row = $result->fetch_assoc()) {
  $routes[] = $row;
}

echo json_encode([
  "success" => true,
  "data" => $routes
]);
