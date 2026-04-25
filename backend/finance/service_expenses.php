<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost","root","","transport_db");

if($conn->connect_error){
    die("Connection failed: ".$conn->connect_error);
}

$sql = "SELECT service_type, service_date, cost FROM service_records ORDER BY service_date DESC";

$result = $conn->query($sql);

$data = [];

if($result){
    while($row = $result->fetch_assoc()){
        $data[] = $row;
    }
}

echo json_encode($data);

$conn->close();

?>