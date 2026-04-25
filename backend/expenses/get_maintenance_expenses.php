<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "transport_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false]);
    exit;
}

$bus_id = $_GET["bus_id"] ?? null;

if (!$bus_id) {
    echo json_encode(["success" => false]);
    exit;
}

$stmt = $conn->prepare("
    SELECT * FROM maintenance_expenses
    WHERE bus_id = ?
    ORDER BY expense_date DESC
");

$stmt->bind_param("i", $bus_id);
$stmt->execute();

$result = $stmt->get_result();

$expenses = [];
$totalAmount = 0;

while ($row = $result->fetch_assoc()) {
    $expenses[] = $row;
    $totalAmount += $row["amount"];
}

echo json_encode([
    "success" => true,
    "data" => $expenses,
    "summary" => [
        "total_expense" => $totalAmount
    ]
]);

$conn->close();