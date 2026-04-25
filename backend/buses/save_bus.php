<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");


$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB error"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$bus_number = $data['bus_number'];
$seats = $data['seating_capacity'];
$model = $data['bus_model'];
$year = $data['manufacturing_year'];
$status = $data['operational_status'];
$remarks = $data['remarks'] ?? null;

/* Check if bus exists */
$check = $conn->prepare("SELECT bus_id FROM buses WHERE bus_number = ?");
$check->bind_param("s", $bus_number);
$check->execute();
$res = $check->get_result();

if ($res->num_rows > 0) {
    /* UPDATE */
    $stmt = $conn->prepare("
        UPDATE buses SET
        seating_capacity = ?,
        bus_model = ?,
        manufacturing_year = ?,
        operational_status = ?,
        remarks = ?
        WHERE bus_number = ?
    ");
    $stmt->bind_param(
        "isisss",
        $seats,
        $model,
        $year,
        $status,
        $remarks,
        $bus_number
    );
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Bus updated"]);
} else {
    /* INSERT */
    $stmt = $conn->prepare("
        INSERT INTO buses
        (bus_number, seating_capacity, bus_model, manufacturing_year, operational_status, remarks)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
        "sissss",
        $bus_number,
        $seats,
        $model,
        $year,
        $status,
        $remarks
    );
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Bus added"]);
}
