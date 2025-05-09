<?php
header('Content-Type: application/json');
require_once '../bookingpage/db_connect.php';

try {
    $stmt = $pdo->query("SELECT first_name, last_name, room_title, checkin, checkout FROM booking ORDER BY id DESC LIMIT 5");
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $bookings]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

