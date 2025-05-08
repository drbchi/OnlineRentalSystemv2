<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once '../loginANDsignup/db_connect.php';

try {
    // 🆕 fetch all users and sort by id DESC (newest first)
    $stmt = $pdo->prepare("SELECT id, username, email, role, status FROM users ORDER BY id DESC");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}




