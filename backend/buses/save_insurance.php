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
   VALIDATION
========================= */
$bus_id             = $data["bus_id"] ?? null;
$policy_number      = trim($data["policy_number"] ?? "");
$insurance_company  = trim($data["insurance_company"] ?? "");
$start_date         = $data["start_date"] ?? "";
$expiry_date        = $data["expiry_date"] ?? "";

if (
    !$bus_id ||
    !$policy_number ||
    !$insurance_company ||
    !$start_date ||
    !$expiry_date
) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);
    exit;
}

/* =========================
   CHECK EXISTING INSURANCE
========================= */
$check = $conn->prepare(
    "SELECT insurance_id FROM bus_insurance WHERE bus_id = ?"
);
$check->bind_param("i", $bus_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {

    /* 🔄 UPDATE */
    $row = $result->fetch_assoc();
    $insurance_id = $row["insurance_id"];

    $stmt = $conn->prepare("
        UPDATE bus_insurance
        SET insurance_company = ?,
            policy_number = ?,
            start_date = ?,
            expiry_date = ?
        WHERE insurance_id = ?
    ");

    $stmt->bind_param(
        "ssssi",
        $insurance_company,
        $policy_number,
        $start_date,
        $expiry_date,
        $insurance_id
    );

    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Insurance updated successfully"
    ]);

} else {

    /* ➕ ADD */
    $stmt = $conn->prepare("
        INSERT INTO bus_insurance
        (bus_id, insurance_company, policy_number, start_date, expiry_date)
        VALUES (?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "issss",
        $bus_id,
        $insurance_company,
        $policy_number,
        $start_date,
        $expiry_date
    );

    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Insurance added successfully"
    ]);
}

$conn->close();
