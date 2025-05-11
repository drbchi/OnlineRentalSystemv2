<?php
header('Content-Type: application/json');
require_once '../loginANDsignup/db_connect.php'; // adjust if needed

$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['id'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["error" => "User ID is required."]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE users SET status = 'suspended' WHERE id = ?");
    $stmt->execute([$userId]);
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

