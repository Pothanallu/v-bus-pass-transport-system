<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost","root","","transport_db");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

/* ======================
   TOTAL REVENUE
====================== */

$revenueQuery = "SELECT SUM(amount) AS total_revenue FROM bus_pass_payments";
$revenueResult = $conn->query($revenueQuery);
$revenueRow = $revenueResult->fetch_assoc();

$totalRevenue = $revenueRow['total_revenue'] ?? 0;


/* ======================
   FUEL EXPENSE
====================== */

$fuelQuery = "SELECT SUM(cost) AS fuel_expense FROM fuel_logs";
$fuelResult = $conn->query($fuelQuery);
$fuelRow = $fuelResult->fetch_assoc();

$fuelExpense = $fuelRow['fuel_expense'] ?? 0;


/* ======================
   SERVICE EXPENSE
====================== */

$serviceQuery = "SELECT SUM(cost) AS service_expense FROM service_records";
$serviceResult = $conn->query($serviceQuery);
$serviceRow = $serviceResult->fetch_assoc();

$serviceExpense = $serviceRow['service_expense'] ?? 0;


/* ======================
   MAINTENANCE EXPENSE
====================== */

$maintenanceQuery = "SELECT SUM(amount) AS maintenance_expense FROM maintenance_expenses";
$maintenanceResult = $conn->query($maintenanceQuery);
$maintenanceRow = $maintenanceResult->fetch_assoc();

$maintenanceExpense = $maintenanceRow['maintenance_expense'] ?? 0;


/* ======================
   TOTAL EXPENSES
====================== */

$totalExpenses = $fuelExpense + $serviceExpense + $maintenanceExpense;


/* ======================
   PROFIT / LOSS
====================== */

$profit = 0;
$loss = 0;

if($totalRevenue > $totalExpenses){
    $profit = $totalRevenue - $totalExpenses;
}else{
    $loss = $totalExpenses - $totalRevenue;
}


/* ======================
   RETURN JSON
====================== */

echo json_encode([
    "total_revenue"=>$totalRevenue,
    "total_expenses"=>$totalExpenses,
    "profit"=>$profit,
    "loss"=>$loss
]);

$conn->close();

?>