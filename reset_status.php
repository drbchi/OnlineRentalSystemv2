<?php
header('Content-Type: application/json');
date_default_timezone_set('Asia/Kathmandu');

$host = 'localhost';
$dbname = 'admin';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
    $roomId = $data['id'];

    $stmt = $pdo->prepare("UPDATE rooms SET status = 'PENDING', approver = NULL, denier = NULL WHERE id = ?");
    $stmt->execute([$roomId]);

    $stmt = $pdo->prepare("SELECT * FROM rooms WHERE id = ?");
    $stmt->execute([$roomId]);
    $room = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($room);
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>