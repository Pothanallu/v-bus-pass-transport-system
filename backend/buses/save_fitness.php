<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "transport_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

/* =========================
   INPUT
========================= */
$bus_id      = $data["bus_id"] ?? null;
$certificate = trim($data["fitness_certificate_no"] ?? "");
$issued_date = $data["fitness_issued_date"] ?? "";
$expiry_date = $data["fitness_expiry_date"] ?? "";
$condition   = trim($data["condition_status"] ?? "");
$remarks     = trim($data["remarks"] ?? "");

/* =========================
   VALIDATION
========================= */
if (!$bus_id || !$certificate || !$issued_date || !$expiry_date || !$condition) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

/* =========================
   CHECK EXISTING FITNESS
========================= */
$check = $conn->prepare("SELECT inspection_id FROM bus_inspection WHERE bus_id = ?");
$check->bind_param("i", $bus_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    /* 🔄 UPDATE */
    $row = $result->fetch_assoc();
    $inspection_id = $row["inspection_id"];

    $stmt = $conn->prepare("
        UPDATE bus_inspection
        SET fitness_certificate_no = ?,
            fitness_issued_date = ?,
            fitness_expiry_date = ?,
            condition_status = ?,
            remarks = ?
        WHERE inspection_id = ?
    ");

    $stmt->bind_param(
        "sssssi",
        $certificate,
        $issued_date,
        $expiry_date,
        $condition,
        $remarks,
        $inspection_id
    );

    $stmt->execute();
    echo json_encode(["success" => true, "message" => "Fitness updated successfully"]);
} else {
    /* ➕ INSERT */
    $stmt = $conn->prepare("
        INSERT INTO bus_inspection
        (bus_id, fitness_certificate_no, fitness_issued_date, fitness_expiry_date, condition_status, remarks)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "isssss",
        $bus_id,
        $certificate,
        $issued_date,
        $expiry_date,
        $condition,
        $remarks
    );

    $stmt->execute();
    echo json_encode(["success" => true, "message" => "Fitness added successfully"]);
}

$conn->close();
