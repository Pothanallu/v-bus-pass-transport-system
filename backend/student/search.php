<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

$reg_no = $_GET['reg_no'] ?? '';

if ($reg_no === '') {
    echo json_encode(["success" => false, "message" => "Reg No required"]);
    exit;
}

/* =====================
   FETCH STUDENT
===================== */
$stmt = $conn->prepare("
    SELECT 
        reg_no,
        name,
        department,
        section,
        year,
        semester,
        phone,
        email,
        photo
    FROM students
    WHERE reg_no = ?
");

$stmt->bind_param("s", $reg_no);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Student not found"]);
    exit;
}

$student = $result->fetch_assoc();

/* =====================
   FETCH BUS PASS (OPTIONAL)
===================== */
$passStmt = $conn->prepare(
    "SELECT * FROM bus_passes WHERE reg_no = ? ORDER BY pass_id DESC LIMIT 1"
);

$bus_pass = null;
if ($passStmt) {
    $passStmt->bind_param("s", $reg_no);
    $passStmt->execute();
    $passRes = $passStmt->get_result();
    if ($passRes->num_rows > 0) {
        $bus_pass = $passRes->fetch_assoc();
    }
}

/* =====================
   RESPONSE
===================== */
echo json_encode([
    "success" => true,
    "student" => $student,
    "bus_pass" => $bus_pass
]);
