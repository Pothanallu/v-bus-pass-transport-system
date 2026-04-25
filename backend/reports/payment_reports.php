<?php

// Allow React requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Database connection
$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$query = mysqli_query($conn,"
SELECT receipt_no, reg_no, amount, payment_date
FROM bus_pass_payments
ORDER BY payment_date DESC
");

$data = [];

while($row = mysqli_fetch_assoc($query)){
$data[] = $row;
}

echo json_encode($data);

?>