<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost","root","","transport_db");

$sql = "
SELECT 
DATE_FORMAT(payment_date,'%Y-%m') as month,
SUM(amount) as revenue
FROM bus_pass_payments
GROUP BY DATE_FORMAT(payment_date,'%Y-%m')
";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()){

$month = $row['month'];
$revenue = $row['revenue'] ?? 0;

/* EXPENSES */

$fuel = $conn->query("
SELECT SUM(cost) as total FROM fuel_logs 
WHERE DATE_FORMAT(fuel_date,'%Y-%m')='$month'
")->fetch_assoc()['total'] ?? 0;

$service = $conn->query("
SELECT SUM(cost) as total FROM service_records 
WHERE DATE_FORMAT(service_date,'%Y-%m')='$month'
")->fetch_assoc()['total'] ?? 0;

$maintenance = $conn->query("
SELECT SUM(amount) as total FROM maintenance_expenses 
WHERE DATE_FORMAT(expense_date,'%Y-%m')='$month'
")->fetch_assoc()['total'] ?? 0;

$expenses = $fuel + $service + $maintenance;

/* PROFIT / LOSS */

$profit = 0;
$loss = 0;

if($revenue > $expenses){
$profit = $revenue - $expenses;
}else{
$loss = $expenses - $revenue;
}

$data[] = [
"month"=>$month,
"revenue"=>$revenue,
"expenses"=>$expenses,
"profit"=>$profit,
"loss"=>$loss
];

}

echo json_encode($data);

$conn->close();

?>