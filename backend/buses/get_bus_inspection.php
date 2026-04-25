<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");
$bus_id = $_GET['bus_id'];

$sql = "SELECT * FROM bus_inspection
        WHERE bus_id = ?
        ORDER BY inspection_date DESC LIMIT 1";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $bus_id);
$stmt->execute();

$res = $stmt->get_result()->fetch_assoc();

echo json_encode(["success" => true, "data" => $res]);
