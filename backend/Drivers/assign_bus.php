<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Connection failed: " . $conn->connect_error
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['bus_number'], $data['driver_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required data"
    ]);
    exit;
}

$bus_number = $data['bus_number'];
$driver_id  = intval($data['driver_id']);
$worker_id  = isset($data['worker_id']) && $data['worker_id'] !== null
              ? intval($data['worker_id'])
              : NULL;

/* ================= GET BUS ID ================= */

$busQuery = $conn->prepare("SELECT bus_id FROM buses WHERE bus_number = ?");
$busQuery->bind_param("s", $bus_number);
$busQuery->execute();
$busResult = $busQuery->get_result();
$busRow = $busResult->fetch_assoc();

if (!$busRow) {
    echo json_encode([
        "success" => false,
        "message" => "Bus not found"
    ]);
    exit;
}

$bus_id = intval($busRow['bus_id']);

/* =====================================================
   LOCK CHECK – ONLY ACTIVE (NOT COMPLETED)
===================================================== */

/* Check Bus */
$checkBus = $conn->prepare("
    SELECT assignment_id FROM bus_assignments 
    WHERE bus_id = ? 
    AND status != 'Completed'
");
$checkBus->bind_param("i", $bus_id);
$checkBus->execute();
if ($checkBus->get_result()->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Bus already assigned"]);
    exit;
}

/* Check Driver */
$checkDriver = $conn->prepare("
    SELECT assignment_id FROM bus_assignments 
    WHERE driver_id = ? 
    AND status != 'Completed'
");
$checkDriver->bind_param("i", $driver_id);
$checkDriver->execute();
if ($checkDriver->get_result()->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Driver already assigned"]);
    exit;
}

/* Check Worker */
if ($worker_id !== NULL) {
    $checkWorker = $conn->prepare("
        SELECT assignment_id FROM bus_assignments 
        WHERE worker_id = ? 
        AND status != 'Completed'
    ");
    $checkWorker->bind_param("i", $worker_id);
    $checkWorker->execute();
    if ($checkWorker->get_result()->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Worker already assigned"]);
        exit;
    }
}

/* ================= INSERT ASSIGNMENT ================= */

$status = "Pending";

$stmt = $conn->prepare("
    INSERT INTO bus_assignments
    (bus_id, driver_id, worker_id, assigned_date, status)
    VALUES (?, ?, ?, CURDATE(), ?)
");

$stmt->bind_param("iiis", $bus_id, $driver_id, $worker_id, $status);

if (!$stmt->execute()) {
    echo json_encode([
        "success" => false,
        "message" => "Insert Error: " . $stmt->error
    ]);
    exit;
}

/* ================= UPDATE DRIVER STATUS ================= */

$updateDriver = $conn->prepare("
    UPDATE drivers SET status='Assigned'
    WHERE driver_id=?
");
$updateDriver->bind_param("i", $driver_id);
$updateDriver->execute();

/* ================= UPDATE WORKER STATUS ================= */

if ($worker_id !== NULL) {
    $updateWorker = $conn->prepare("
        UPDATE workers SET status='Assigned'
        WHERE worker_id=?
    ");
    $updateWorker->bind_param("i", $worker_id);
    $updateWorker->execute();
}

echo json_encode([
    "success" => true,
    "message" => "Bus assigned successfully"
]);

$stmt->close();
$conn->close();
?>