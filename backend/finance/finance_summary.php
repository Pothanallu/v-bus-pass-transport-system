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

// Finance summary query
$sql = "
SELECT
    IFNULL((SELECT SUM(amount) FROM bus_pass_payments),0) AS total_revenue,
    IFNULL((SELECT SUM(cost) FROM fuel_logs),0) AS fuel_expense,
    IFNULL((SELECT SUM(cost) FROM service_records),0) AS service_expense,
    IFNULL((SELECT SUM(amount) FROM maintenance_expenses),0) AS maintenance_expense
";

$result = $conn->query($sql);

if($result){

$row = $result->fetch_assoc();

$revenue = (float)$row['total_revenue'];
$fuel = (float)$row['fuel_expense'];
$service = (float)$row['service_expense'];
$maintenance = (float)$row['maintenance_expense'];

$total_expenses = $fuel + $service + $maintenance;
$net_balance = $revenue - $total_expenses;

echo json_encode([
    "total_revenue" => $revenue,
    "total_expenses" => $total_expenses,
    "net_balance" => $net_balance
]);

}else{

echo json_encode([
    "total_revenue" => 0,
    "total_expenses" => 0,
    "net_balance" => 0
]);

}

$conn->close();

?>