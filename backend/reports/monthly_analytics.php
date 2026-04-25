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
SELECT 
DATE_FORMAT(payment_date,'%b') as month,
SUM(amount) as revenue
FROM bus_pass_payments
GROUP BY MONTH(payment_date)
ORDER BY MONTH(payment_date)
");

$data = [];

while($row = mysqli_fetch_assoc($query)){
    $data[] = $row;
}

echo json_encode($data);

?>