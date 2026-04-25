<?php

// Allow React requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Database connection
$conn = new mysqli("localhost", "root", "", "transport_db");

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed"
    ]);
    exit();
}

// Query fuel logs
$sql = "SELECT fuel_date, liters, cost FROM fuel_logs ORDER BY fuel_date DESC";

$result = $conn->query($sql);

$data = [];

if ($result) {

    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "fuel_date" => $row["fuel_date"],
            "liters" => $row["liters"],
            "cost" => $row["cost"]
        ];
    }

}

// Return JSON
echo json_encode($data);

$conn->close();

?>