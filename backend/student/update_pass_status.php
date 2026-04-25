<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

date_default_timezone_set('Asia/Kolkata'); 

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . "/../vendor/phpmailer/Exception.php";
require_once __DIR__ . "/../vendor/phpmailer/PHPMailer.php";
require_once __DIR__ . "/../vendor/phpmailer/SMTP.php";

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$pass_id = $data['pass_id'] ?? null;
$status  = $data['status'] ?? '';
$rejection_reason = trim($data['rejection_reason'] ?? '');

if (!$pass_id || !in_array($status, ['Approved', 'Rejected'])) {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

/* =====================================
   APPROVAL → PAYMENT VALIDATION
===================================== */
if ($status === "Approved") {

    // Get total fee
    $stmt = $conn->prepare(
        "SELECT tf.total_fee
         FROM bus_passes bp
         JOIN transport_fees tf ON bp.fee_id = tf.fee_id
         WHERE bp.pass_id = ?"
    );
    $stmt->bind_param("i", $pass_id);
    $stmt->execute();
    $feeRes = $stmt->get_result();

    if ($feeRes->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Fee not mapped"]);
        exit;
    }

    $total_fee = (float)$feeRes->fetch_assoc()['total_fee'];

    // Get total paid
    $stmt = $conn->prepare(
        "SELECT IFNULL(SUM(amount), 0) AS total_paid
         FROM bus_pass_payments
         WHERE pass_id = ?"
    );
    $stmt->bind_param("i", $pass_id);
    $stmt->execute();
    $paidRes = $stmt->get_result();
    $total_paid = (float)$paidRes->fetch_assoc()['total_paid'];

    if ($total_paid < $total_fee) {
        echo json_encode([
            "success" => false,
            "message" => "Cannot approve. Fee not fully paid."
        ]);
        exit;
    }
}

/* =====================================
   REJECTION → REASON REQUIRED
===================================== */
if ($status === "Rejected" && $rejection_reason === '') {
    echo json_encode(["success" => false, "message" => "Rejection reason is required"]);
    exit;
}

/* =====================================
   UPDATE BUS PASS
===================================== */
$stmt = $conn->prepare(
    "UPDATE bus_passes
     SET status = ?, rejection_reason = ?
     WHERE pass_id = ?"
);
$stmt->bind_param("ssi", $status, $rejection_reason, $pass_id);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Failed to update status"]);
    exit;
}

/* =====================================
   FETCH STUDENT DETAILS
===================================== */
$stmt = $conn->prepare(
    "SELECT s.name, s.email
     FROM students s
     JOIN bus_passes bp ON bp.reg_no = s.reg_no
     WHERE bp.pass_id = ?"
);
$stmt->bind_param("i", $pass_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Student email not found"]);
    exit;
}

$student = $res->fetch_assoc();

/* =====================================
   SEND EMAIL USING SMTP
===================================== */
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'vignan.transportuni@gmail.com';
    $mail->Password   = 'rtqo aics ient vuwr';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom(
        'vignan.transportuni@gmail.com',
        'College Transport Department'
    );

    $mail->addAddress($student['email'], $student['name']);

    $mail->isHTML(false);
    $mail->Subject = 'Bus Pass Application Status';

    if ($status === "Approved") {
        $mail->Body =
            "Dear {$student['name']},\n\n" .
            "Greetings from the College Transport Department.\n\n" .
            "We are pleased to inform you that your student bus pass application has been APPROVED.\n\n" .
            "Please visit the Transport Office and collect your bus pass during working hours.\n\n" .
            "Warm regards,\n" .
            "Transport Officer\n" .
            "College Transport Department";
    } else {
        $mail->Body =
            "Dear {$student['name']},\n\n" .
            "Greetings from the College Transport Department.\n\n" .
            "Your student bus pass application has been REJECTED.\n\n" .
            "Reason:\n$rejection_reason\n\n" .
            "Please visit the Transport Office to resolve the issue.\n\n" .
            "Warm regards,\n" .
            "Transport Officer\n" .
            "College Transport Department";
    }

    $mail->send();

    /* =====================================
       MAIL LOG (AFTER SUCCESS)
    ===================================== */
    $logMessage =
        date("Y-m-d H:i:s") . " | " .
        "Status: $status | " .
        "To: {$student['email']} | " .
        "Pass ID: $pass_id\n";

    file_put_contents(
        __DIR__ . "/mail_log.txt",
        $logMessage,
        FILE_APPEND
    );

} catch (Exception $e) {
    file_put_contents(
        __DIR__ . "/mail_error_log.txt",
        date("Y-m-d H:i:s") . " | " . $mail->ErrorInfo . "\n",
        FILE_APPEND
    );
}

/* =====================================
   RESPONSE
===================================== */
echo json_encode([
    "success" => true,
    "message" => "Bus pass $status successfully. Email processed."
]);
