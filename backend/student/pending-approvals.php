<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

/*
 We select:
 - Pending bus passes
 - Calculate total_fee
 - Calculate total_paid
 - Show ONLY fully paid + pending
*/

$sql = "
SELECT 
    s.reg_no,
    s.name,
    bp.pass_id,
    tf.total_fee,
    IFNULL(SUM(bpp.amount), 0) AS total_paid
FROM bus_passes bp
JOIN students s ON s.reg_no = bp.reg_no
JOIN transport_fees tf ON tf.fee_id = bp.fee_id
LEFT JOIN bus_pass_payments bpp ON bpp.pass_id = bp.pass_id
WHERE bp.status = 'Pending'
GROUP BY bp.pass_id
HAVING total_paid >= total_fee
ORDER BY bp.pass_id DESC
";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = [
        "reg_no" => $row["reg_no"],
        "name"   => $row["name"]
    ];
}

echo json_encode($data);
