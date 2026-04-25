<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

/* ================= DB CONNECTION ================= */

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

/* ================= GET INPUT ================= */

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["assignment_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Assignment ID is required"
    ]);
    exit;
}

$assignment_id = intval($data["assignment_id"]);

/* ================= DELETE QUERY ================= */

$stmt = $conn->prepare("DELETE FROM bus_assignments WHERE assignment_id = ?");
$stmt->bind_param("i", $assignment_id);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Assignment deleted successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Assignment not found"
        ]);
    }

} else {
    echo json_encode([
        "success" => false,
        "message" => "Delete failed"
    ]);
}

$stmt->close();
$conn->close();
?>