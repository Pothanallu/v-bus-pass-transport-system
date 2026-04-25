<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$pass_id = intval($data['pass_id'] ?? 0);
$amount = floatval($data['amount'] ?? 0);
$payment_date = $data['payment_date'] ?? '';

if ($pass_id <= 0 || $amount <= 0 || $payment_date === '') {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

try {
    // 🔒 START TRANSACTION
    $conn->begin_transaction();

    /* ============================
       GET REG NO + TOTAL FEE
    ============================ */
    $stmt = $conn->prepare(
        "SELECT bp.reg_no, tf.total_fee
         FROM bus_passes bp
         JOIN transport_fees tf ON bp.fee_id = tf.fee_id
         WHERE bp.pass_id = ?
         FOR UPDATE"
    );
    $stmt->bind_param("i", $pass_id);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows === 0) {
        throw new Exception("Fee not mapped");
    }

    $row = $res->fetch_assoc();
    $reg_no = $row['reg_no'];
    $total_fee = floatval($row['total_fee']);

    /* ============================
       GET TOTAL PAID
    ============================ */
    $stmt = $conn->prepare(
        "SELECT IFNULL(SUM(amount),0) AS total_paid
         FROM bus_pass_payments
         WHERE pass_id = ?"
    );
    $stmt->bind_param("i", $pass_id);
    $stmt->execute();
    $total_paid = floatval(
        $stmt->get_result()->fetch_assoc()['total_paid']
    );

    if (($total_paid + $amount) > $total_fee) {
        throw new Exception("Payment exceeds total fee");
    }

    /* ============================
    GENERATE RECEIPT NUMBER
    TP-RCPT-1, TP-RCPT-2, ...
    ============================ */
    $res = $conn->query(
        "SELECT IFNULL(MAX(payment_id),0) + 1 AS next_id FROM bus_pass_payments"
    );

    $nextId = $res->fetch_assoc()['next_id'];
    $receipt_no = "TP-RCPT-" . $nextId;

    /* ============================
       INSERT PAYMENT
    ============================ */
    $stmt = $conn->prepare(
        "INSERT INTO bus_pass_payments
        (pass_id, reg_no, receipt_no, amount, payment_date, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())"
    );
    $stmt->bind_param(
        "issds",
        $pass_id,
        $reg_no,
        $receipt_no,
        $amount,
        $payment_date
    );
    $stmt->execute();

    /* ============================
       UPDATE PAYMENT STATUS
    ============================ */
    $new_total = $total_paid + $amount;
    $payment_status = ($new_total >= $total_fee) ? "Fully Paid" : "Partially Paid";

    $stmt = $conn->prepare(
        "UPDATE bus_passes SET payment_status = ? WHERE pass_id = ?"
    );
    $stmt->bind_param("si", $payment_status, $pass_id);
    $stmt->execute();

    // ✅ COMMIT
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Payment added successfully",
        "receipt_no" => $receipt_no,
        "payment_status" => $status
    ]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
