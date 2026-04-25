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
bus_no,
city,
COUNT(reg_no) as students
FROM bus_passes
GROUP BY bus_no,city
ORDER BY students DESC
");

$data = [];

while($row = mysqli_fetch_assoc($query)){
    $data[] = $row;
}

echo json_encode($data);

?>