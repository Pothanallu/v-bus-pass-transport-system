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

/* =========================
   VALIDATION
========================= */
$bus_id = $data["bus_id"] ?? null;
$expense_type = trim($data["expense_type"] ?? "");
$description = trim($data["description"] ?? "");
$expense_date = $data["expense_date"] ?? "";
$amount = $data["amount"] ?? "";

if (!$bus_id || !$expense_type || !$expense_date || !$amount) {
    echo json_encode([
        "success" => false,
        "message" => "Required fields missing"
    ]);
    exit;
}

/* =========================
   INSERT
========================= */

$stmt = $conn->prepare("
    INSERT INTO maintenance_expenses
    (bus_id, expense_type, description, expense_date, amount)
    VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "isssd",
    $bus_id,
    $expense_type,
    $description,
    $expense_date,
    $amount
);

$stmt->execute();

echo json_encode([
    "success" => true,
    "message" => "Expense added successfully"
]);

$conn->close();