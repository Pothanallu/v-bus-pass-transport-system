<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "transport_db");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['assignment_id'], $data['status'])) {
    echo json_encode(["success" => false, "message" => "Missing data"]);
    exit;
}

$assignment_id = intval($data['assignment_id']);
$status = $data['status'];

/* ================= UPDATE ASSIGNMENT STATUS ================= */

$stmt = $conn->prepare("
    UPDATE bus_assignments 
    SET status = ? 
    WHERE assignment_id = ?
");
$stmt->bind_param("si", $status, $assignment_id);
$stmt->execute();

/* ================= GET DRIVER & WORKER ================= */

$get = $conn->prepare("
    SELECT driver_id, worker_id 
    FROM bus_assignments 
    WHERE assignment_id = ?
");
$get->bind_param("i", $assignment_id);
$get->execute();
$result = $get->get_result();
$row = $result->fetch_assoc();

$driver_id = $row['driver_id'];
$worker_id = $row['worker_id'];

/* ================= IF COMPLETED → RESET STATUS ================= */

if ($status === "Completed") {

    // Reset Driver
    $resetDriver = $conn->prepare("
        UPDATE drivers 
        SET status = 'Available' 
        WHERE driver_id = ?
    ");
    $resetDriver->bind_param("i", $driver_id);
    $resetDriver->execute();

    // Reset Worker
    if ($worker_id) {
        $resetWorker = $conn->prepare("
            UPDATE workers 
            SET status = 'Available' 
            WHERE worker_id = ?
        ");
        $resetWorker->bind_param("i", $worker_id);
        $resetWorker->execute();
    }
}

echo json_encode(["success" => true]);

$conn->close();
?>