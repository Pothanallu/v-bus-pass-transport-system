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

/* GET OPERATIONAL STATUS */
$stmt = $conn->prepare("SELECT operational_status FROM buses WHERE bus_id = ?");
$stmt->bind_param("i", $bus_id);
$stmt->execute();
$res = $stmt->get_result();
$bus = $res->fetch_assoc();

/* FITNESS STATUS */
$stmt = $conn->prepare("
    SELECT fitness_expiry_date
    FROM bus_inspection
    WHERE bus_id = ?
");
$stmt->bind_param("i", $bus_id);
$stmt->execute();
$res = $stmt->get_result();
$inspection = $res->fetch_assoc();

$today = date('Y-m-d');
$fitness_status = "No Record";

if ($inspection) {
    $fitness_status =
        ($inspection["fitness_expiry_date"] >= $today)
        ? "Valid"
        : "Expired";
}

/* LAST SERVICE */
$stmt = $conn->prepare("
    SELECT service_date
    FROM service_records
    WHERE bus_id = ?
    ORDER BY service_date DESC
    LIMIT 1
");
$stmt->bind_param("i", $bus_id);
$stmt->execute();
$res = $stmt->get_result();
$service = $res->fetch_assoc();

/* TOTAL EXPENSE */
$stmt = $conn->prepare("
    SELECT SUM(amount) as total
    FROM maintenance_expenses
    WHERE bus_id = ?
");
$stmt->bind_param("i", $bus_id);
$stmt->execute();
$res = $stmt->get_result();
$expense = $res->fetch_assoc();

$total_expense = $expense["total"] ?? 0;

/* OVERALL HEALTH LOGIC */
$overall_health = "Good";

if ($bus["operational_status"] !== "Active") {
    $overall_health = "Not Operational";
} elseif ($fitness_status === "Expired") {
    $overall_health = "Fitness Expired";
} elseif ($total_expense > 100000) {
    $overall_health = "High Maintenance";
}

echo json_encode([
    "success" => true,
    "data" => [
        "operational_status" => $bus["operational_status"],
        "fitness_status" => $fitness_status,
        "last_service_date" => $service["service_date"] ?? null,
        "total_expense" => $total_expense,
        "overall_health" => $overall_health
    ]
]);

$conn->close();