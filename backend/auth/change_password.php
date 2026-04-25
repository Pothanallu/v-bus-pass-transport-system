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

/* =========================
   READ INPUT
========================= */
$data = json_decode(file_get_contents("php://input"), true);

$admin_id     = intval($data['admin_id'] ?? 0);
$old_password = trim($data['old_password'] ?? '');
$new_password = trim($data['new_password'] ?? '');

if ($admin_id <= 0 || $old_password === '' || $new_password === '') {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);
    exit;
}

/* =========================
   FETCH CURRENT PASSWORD
========================= */
$stmt = $conn->prepare(
    "SELECT password FROM transport_admins WHERE admin_id = ? AND status = 'Active'"
);
$stmt->bind_param("i", $admin_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Admin not found or inactive"
    ]);
    exit;
}

$row = $result->fetch_assoc();
$db_password = $row['password'];

/* =========================
   VERIFY OLD PASSWORD
========================= */
$is_valid = false;

/* ✔ Handles BOTH cases:
   - Old plain-text password
   - New hashed password
*/
if (password_verify($old_password, $db_password)) {
    $is_valid = true;
} elseif ($old_password === $db_password) {
    // fallback for old plain-text passwords
    $is_valid = true;
}

if (!$is_valid) {
    echo json_encode([
        "success" => false,
        "message" => "Current password is incorrect"
    ]);
    exit;
}

/* =========================
   UPDATE WITH HASHED PASSWORD
========================= */
$new_hash = password_hash($new_password, PASSWORD_DEFAULT);

$update = $conn->prepare(
    "UPDATE transport_admins SET password = ? WHERE admin_id = ?"
);
$update->bind_param("si", $new_hash, $admin_id);

if (!$update->execute()) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to update password"
    ]);
    exit;
}

/* =========================
   SUCCESS RESPONSE
========================= */
echo json_encode([
    "success" => true,
    "message" => "Password updated successfully. Please login again."
]);
