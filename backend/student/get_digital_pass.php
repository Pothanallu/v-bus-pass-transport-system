<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB error"]);
    exit;
}

$pass_id = $_GET['pass_id'] ?? '';

if ($pass_id === '') {
    echo json_encode(["success" => false, "message" => "Pass ID required"]);
    exit;
}

$sql = "
SELECT 
  bp.pass_id,
  bp.city,
  bp.bus_no,
  bp.boarding_point,
  bp.status,
  s.reg_no,
  s.name,
  s.department,
  s.section,
  s.year,
  s.phone,
  s.photo
FROM bus_passes bp
JOIN students s ON s.reg_no = bp.reg_no
WHERE bp.pass_id = ? AND bp.status = 'Approved'
";


$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $pass_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Approved bus pass not found"
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "data" => $result->fetch_assoc()
]);
