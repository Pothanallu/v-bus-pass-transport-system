<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

/* =========================
   INPUTS FROM FRONTEND
========================= */
$reg_no         = $data['reg_no'] ?? '';
$city           = $data['city'] ?? '';
$bus_no         = $data['bus_no'] ?? '';
$boarding_point = $data['route'] ?? '';

/* =========================
   VALIDATION
========================= */
if ($reg_no === '' || $city === '' || $bus_no === '' || $boarding_point === '') {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);
    exit;
}

/* =========================
   1️⃣ CHECK STUDENT EXISTS
========================= */
$studentStmt = $conn->prepare(
    "SELECT reg_no FROM students WHERE reg_no = ?"
);
$studentStmt->bind_param("s", $reg_no);
$studentStmt->execute();

if ($studentStmt->get_result()->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Student does not exist"
    ]);
    exit;
}

/* =========================
   2️⃣ CHECK EXISTING PASS
========================= */
$checkStmt = $conn->prepare(
    "SELECT pass_id FROM bus_passes
     WHERE reg_no = ?
     AND status IN ('Pending', 'Approved')"
);
$checkStmt->bind_param("s", $reg_no);
$checkStmt->execute();

if ($checkStmt->get_result()->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Bus pass already exists for this student"
    ]);
    exit;
}

/* =========================
   3️⃣ INSERT BUS PASS
========================= */
$insertStmt = $conn->prepare(
    "INSERT INTO bus_passes
     (reg_no, city, bus_no, boarding_point)
     VALUES (?, ?, ?, ?)"
);

$insertStmt->bind_param(
    "ssss",
    $reg_no,
    $city,
    $bus_no,
    $boarding_point
);

if (!$insertStmt->execute()) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to create bus pass"
    ]);
    exit;
}

$pass_id = $insertStmt->insert_id;

/* =========================
   4️⃣ AUTO-MAP FEE
========================= */
$mapStmt = $conn->prepare(
    "UPDATE bus_passes bp
     JOIN transport_fees tf ON tf.city = bp.city
     SET bp.fee_id = tf.fee_id
     WHERE bp.pass_id = ?"
);
$mapStmt->bind_param("i", $pass_id);
$mapStmt->execute();

/* =========================
   5️⃣ RESPONSE
========================= */
echo json_encode([
    "success" => true,
    "message" => "Bus pass created successfully",
    "pass_id" => $pass_id
]);
