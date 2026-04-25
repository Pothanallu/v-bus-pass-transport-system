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

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if ($username === '' || $password === '') {
    echo json_encode(["success" => false, "message" => "Username or password missing"]);
    exit;
}

$sql = "SELECT * FROM transport_admins 
        WHERE username = ? 
        AND password = ? 
        AND status = 'Active'";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $admin = $result->fetch_assoc();
    echo json_encode([
        "success" => true,
        "admin" => [
            "admin_id" => $admin['admin_id'],
            "name" => $admin['name'],
            "role" => $admin['role']
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid username or password"
    ]);
}
?>
