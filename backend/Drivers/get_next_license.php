<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include("../config/db.php");

/* Get last driver ID */
$result = $conn->query("SELECT driver_id FROM drivers ORDER BY driver_id DESC LIMIT 1");

$nextNumber = 1;

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $nextNumber = $row['driver_id'] + 1;
}

/* Format License */
$year = date("Y");
$license = "DL-" . $year . "-" . str_pad($nextNumber, 3, "0", STR_PAD_LEFT);

echo json_encode([
    "success" => true,
    "license" => $license
]);
?>
