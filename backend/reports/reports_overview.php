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

/* TOTAL STUDENTS */

$q = mysqli_query($conn,"SELECT COUNT(*) as total FROM students");
$data['students'] = mysqli_fetch_assoc($q)['total'];


/* TOTAL BUSES */

$q = mysqli_query($conn,"SELECT COUNT(*) as total FROM buses");
$data['buses'] = mysqli_fetch_assoc($q)['total'];


/* TOTAL DRIVERS */

$q = mysqli_query($conn,"SELECT COUNT(*) as total FROM drivers");
$data['drivers'] = mysqli_fetch_assoc($q)['total'];


/* TOTAL REVENUE */

$q = mysqli_query($conn,"SELECT SUM(amount) as total FROM bus_pass_payments");
$row = mysqli_fetch_assoc($q);
$data['revenue'] = $row['total'] ?? 0;


/* PASS STATUS */

$q = mysqli_query($conn,"
SELECT status, COUNT(*) as total 
FROM bus_passes 
GROUP BY status
");

$data['approved'] = 0;
$data['pending'] = 0;
$data['rejected'] = 0;

while($row = mysqli_fetch_assoc($q)){

    if($row['status']=="Approved"){
        $data['approved'] = $row['total'];
    }

    if($row['status']=="Pending"){
        $data['pending'] = $row['total'];
    }

    if($row['status']=="Rejected"){
        $data['rejected'] = $row['total'];
    }

}

echo json_encode($data);

?>