<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

/* ✅ SUPPORT BOTH GET & POST */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $reg_no = trim($data['reg_no'] ?? '');
} else {
    $reg_no = trim($_GET['reg_no'] ?? '');
}

if ($reg_no === '') {
    echo json_encode(["success" => false, "message" => "Registration number required"]);
    exit;
}

/* =========================
   GET LATEST BUS PASS
========================= */
$stmt = $conn->prepare(
    "SELECT pass_id, city, fee_id, status
     FROM bus_passes
     WHERE reg_no = ?
     ORDER BY pass_id DESC
     LIMIT 1"
);
$stmt->bind_param("s", $reg_no);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "No bus pass found"]);
    exit;
}

$pass = $res->fetch_assoc();
$pass_id = (int)$pass['pass_id'];
$city = $pass['city'];
$fee_id = $pass['fee_id'];
$status = $pass['status'];

/* =========================
   AUTO MAP FEE IF NULL
========================= */
$total_fee = 0;

if ($fee_id === null) {
    $stmt = $conn->prepare(
        "SELECT fee_id, total_fee FROM transport_fees WHERE city = ? LIMIT 1"
    );
    $stmt->bind_param("s", $city);
    $stmt->execute();
    $feeRes = $stmt->get_result();

    if ($fee = $feeRes->fetch_assoc()) {
        $fee_id = $fee['fee_id'];
        $total_fee = (float)$fee['total_fee'];

        $upd = $conn->prepare(
            "UPDATE bus_passes SET fee_id = ? WHERE pass_id = ?"
        );
        $upd->bind_param("ii", $fee_id, $pass_id);
        $upd->execute();
    }
} else {
    $stmt = $conn->prepare(
        "SELECT total_fee FROM transport_fees WHERE fee_id = ?"
    );
    $stmt->bind_param("i", $fee_id);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $total_fee = (float)($row['total_fee'] ?? 0);
}

/* =========================
   PAYMENTS
========================= */
$total_paid = 0;
$payments = [];

$stmt = $conn->prepare(
    "SELECT receipt_no, amount, payment_date
     FROM bus_pass_payments
     WHERE pass_id = ?
     ORDER BY created_at DESC"
);
$stmt->bind_param("i", $pass_id);
$stmt->execute();
$payRes = $stmt->get_result();

while ($row = $payRes->fetch_assoc()) {
    $payments[] = $row;
    $total_paid += (float)$row['amount'];
}

$balance = max($total_fee - $total_paid, 0);

$payment_status =
    ($total_paid == 0) ? "Not Paid" :
    (($total_paid < $total_fee) ? "Partially Paid" : "Fully Paid");

/* =========================
   RESPONSE
========================= */
echo json_encode([
    "success" => true,
    "data" => [
        "pass_id" => $pass_id,
        "city" => $city,
        "status" => $status,
        "total_fee" => $total_fee,
        "total_paid" => $total_paid,
        "balance" => $balance,
        "payment_status" => $payment_status,
        "payments" => $payments
    ]
]);
