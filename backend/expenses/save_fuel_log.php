<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

/* =========================
   VALIDATION
========================= */
$bus_id = $data["bus_id"] ?? null;
$fuel_date = $data["fuel_date"] ?? "";
$liters = $data["liters"] ?? "";
$cost = $data["cost"] ?? "";
$odometer = $data["odometer_reading"] ?? "";

if (!$bus_id || !$fuel_date || !$liters || !$cost || !$odometer) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);
    exit;
}

/* =========================
   GET LAST ODOMETER
========================= */
$lastMileage = 0;

$stmt = $conn->prepare("
    SELECT odometer_reading 
    FROM fuel_logs 
    WHERE bus_id = ?
    ORDER BY fuel_date DESC, fuel_id DESC
    LIMIT 1
");

$stmt->bind_param("i", $bus_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $lastOdometer = $row["odometer_reading"];

    $distance = $odometer - $lastOdometer;

    if ($distance > 0 && $liters > 0) {
        $lastMileage = round($distance / $liters, 2);
    }
}

/* =========================
   INSERT FUEL LOG
========================= */

$stmt = $conn->prepare("
    INSERT INTO fuel_logs
    (bus_id, fuel_date, liters, cost, odometer_reading, mileage)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "isddid",
    $bus_id,
    $fuel_date,
    $liters,
    $cost,
    $odometer,
    $lastMileage
);

$stmt->execute();

echo json_encode([
    "success" => true,
    "message" => "Fuel log added successfully",
    "calculated_mileage" => $lastMileage
]);

$conn->close();