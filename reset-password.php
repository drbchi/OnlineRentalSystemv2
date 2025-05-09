<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set the timezone explicitly
date_default_timezone_set('Asia/Kolkata');

// Log function for debugging
function logDebug($message) {
    file_put_contents('debug_reset_password.log', date('Y-m-d H:i:s') . " - " . $message . "\n", FILE_APPEND);
}

logDebug("Starting reset-password.php");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "rental";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    logDebug("Connection failed: " . $conn->connect_error);
    echo "db_error: " . $conn->connect_error;
    exit;
}

logDebug("Database connection successful");

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    logDebug("Invalid request method: " . $_SERVER["REQUEST_METHOD"]);
    echo "invalid_request";
    $conn->close();
    exit;
}

if (!isset($_POST["email"]) || !isset($_POST["password"])) {
    logDebug("Missing email or password in POST request");
    echo "missing_data";
    $conn->close();
    exit;
}

$email = strtolower($conn->real_escape_string($_POST["email"]));
$new_password = $_POST["password"];
logDebug("Received email: $email, New password: [REDACTED]");

// Check if the email exists
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
if (!$stmt) {
    logDebug("Prepare failed (SELECT): " . $conn->error);
    echo "sql_error: " . $conn->error;
    $conn->close();
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    logDebug("Email not found: $email");
    echo "email_not_found";
    $stmt->close();
    $conn->close();
    exit;
}

logDebug("Email found: $email");

// Hash the new password
$hashed_password = password_hash($new_password, PASSWORD_BCRYPT);
logDebug("Hashed new password: $hashed_password");

// Update the password
$update_stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
if (!$update_stmt) {
    logDebug("Prepare failed (UPDATE): " . $conn->error);
    echo "sql_error: " . $conn->error;
    $stmt->close();
    $conn->close();
    exit;
}

$update_stmt->bind_param("ss", $hashed_password, $email);
$update_success = $update_stmt->execute();
logDebug("UPDATE query executed: " . ($update_success ? "Yes" : "No"));

if (!$update_success) {
    logDebug("UPDATE failed: " . $update_stmt->error);
    echo "sql_error: " . $update_stmt->error;
    $update_stmt->close();
    $stmt->close();
    $conn->close();
    exit;
}

$affected_rows = $update_stmt->affected_rows;
logDebug("Affected rows: $affected_rows");

if ($affected_rows == 0) {
    logDebug("No rows affected - email not found or password unchanged: $email");
    echo "error: No rows affected";
    $update_stmt->close();
    $stmt->close();
    $conn->close();
    exit;
}

// Verify the update
$verify_stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
if (!$verify_stmt) {
    logDebug("Prepare failed (VERIFY): " . $conn->error);
    echo "sql_error: " . $conn->error;
    $update_stmt->close();
    $stmt->close();
    $conn->close();
    exit;
}

$verify_stmt->bind_param("s", $email);
$verify_stmt->execute();
$verify_result = $verify_stmt->get_result();
$verify_row = $verify_result->fetch_assoc();

logDebug("Database verification - password: " . $verify_row['password']);

if (!password_verify($new_password, $verify_row['password'])) {
    logDebug("Verification failed: Stored password does not match new password");
    echo "error: Database verification failed";
    $verify_stmt->close();
    $update_stmt->close();
    $stmt->close();
    $conn->close();
    exit;
}

$verify_stmt->close();
$update_stmt->close();
$stmt->close();
$conn->close();

echo "success:log-in.html";
logDebug("Finished reset-password.php");
?>