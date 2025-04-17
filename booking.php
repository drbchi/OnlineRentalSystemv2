<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/php/logs/php_error_log');

require_once 'db_connect.php';

function convertToMySQLDate($dateStr) {
    if ($dateStr === 'Not Selected' || empty($dateStr)) return null;
    $dateStr = trim(preg_replace('/,+/', ',', preg_replace('/\s+/', ' ', $dateStr)), ', ');
    $date = DateTime::createFromFormat('D, d M Y', $dateStr);
    if ($date === false) throw new Exception("Invalid date format: $dateStr");
    $now = new DateTime('today');
    if ($date < $now) throw new Exception("Date must be today or in the future: $dateStr");
    return $date->format('Y-m-d');
}

function convertToMySQLTime($timeStr) {
    if ($timeStr === 'Not Selected' || empty($timeStr)) return null;
    $time = DateTime::createFromFormat('h:i A', trim($timeStr));
    if ($time === false) throw new Exception("Invalid time format: $timeStr");
    return $time->format('H:i:s');
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        throw new Exception('Invalid or empty input data');
    }

    file_put_contents('debug.log', "Input received at " . date('Y-m-d H:i:s') . ":\n" . print_r($input, true) . "\n\n", FILE_APPEND);

    $required = ['firstName', 'lastName', 'phone', 'checkin', 'checkout', 'checkInTime', 'checkOutTime', 'paymentMethod', 'roomType'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || $input[$field] === 'Not Selected' || $input[$field] === '') {
            throw new Exception("Missing or invalid $field");
        }
    }

    $data = [
        'first_name' => $input['firstName'],
        'last_name' => $input['lastName'],
        'phone' => $input['phone'],
        'region' => $input['region'] ?? '',
        'checkin' => convertToMySQLDate($input['checkin']),
        'checkout' => convertToMySQLDate($input['checkout']),
        'check_in_time' => convertToMySQLTime($input['checkInTime']),
        'check_out_time' => convertToMySQLTime($input['checkOutTime']),
        'payment_method' => $input['paymentMethod'],
        'room_type' => $input['roomType'],
        'user_id' => $input['userId'] ?? 'guest'
    ];

    // Validation
    if (!preg_match('/^[a-zA-Z\s-]+$/', $data['first_name'])) throw new Exception('First name can only contain letters, spaces, and hyphens');
    if (!preg_match('/^[a-zA-Z\s-]+$/', $data['last_name'])) throw new Exception('Last name can only contain letters, spaces, and hyphens');
    if (!preg_match('/^\d{10,15}$/', $data['phone'])) throw new Exception('Phone number must be 10-15 digits');
    if (!$data['checkin'] || !$data['checkout']) throw new Exception('Invalid date format');
    if ($data['checkout'] <= $data['checkin']) throw new Exception('Check-out date must be after check-in date');
    if (!$data['check_in_time'] || !$data['check_out_time']) throw new Exception('Invalid time format');

    $sql = "INSERT INTO booking (
        first_name, last_name, phone, region, checkin, checkout, 
        check_in_time, check_out_time, payment_method, room_type, user_id
    ) VALUES (
        :first_name, :last_name, :phone, :region, :checkin, :checkout,
        :check_in_time, :check_out_time, :payment_method, :room_type, :user_id
    )";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($data);

    $bookingId = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Booking created successfully',
        'bookingId' => $bookingId
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    file_put_contents('debug.log', "Database error at " . date('Y-m-d H:i:s') . ": " . $e->getMessage() . "\nSQL: $sql\nData: " . print_r($data, true) . "\n\n", FILE_APPEND);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>