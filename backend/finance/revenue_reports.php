<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost","root","","transport_db");

$sql = "SELECT receipt_no, reg_no, amount, payment_date 
        FROM bus_pass_payments
        ORDER BY payment_date DESC";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()){
$data[] = $row;
}

echo json_encode($data);

$conn->close();

?>