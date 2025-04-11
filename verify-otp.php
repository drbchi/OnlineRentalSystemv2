<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set the timezone explicitly
date_default_timezone_set('Asia/Kolkata');

// Log function for debugging
function logDebug($message) {
    file_put_contents('debug_verify_otp.log', date('Y-m-d H:i:s') . " - " . $message . "\n", FILE_APPEND);
}

logDebug("Starting verify-otp.php");

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

if (!isset($_POST["email"]) || !isset($_POST["otp"]) || !isset($_POST["flow"])) {
    logDebug("Missing email, OTP, or flow in POST request");
    echo "missing_data";
    $conn->close();
    exit;
}

$email = strtolower($conn->real_escape_string($_POST["email"]));
$otp = $conn->real_escape_string($_POST["otp"]);
$flow = $conn->real_escape_string($_POST["flow"]);
logDebug("Received email: $email, OTP: $otp, Flow: $flow");

// Check if the email exists and get the stored OTP and expiration
$stmt = $conn->prepare("SELECT reset_token, reset_expires FROM users WHERE email = ?");
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

$row = $result->fetch_assoc();
$stored_otp = $row['reset_token'];
$expires_at = $row['reset_expires'];
logDebug("Stored OTP: $stored_otp, Expires at: $expires_at");

if (is_null($stored_otp) || is_null($expires_at)) {
    logDebug("OTP or expiration time is NULL for email: $email");
    echo "invalid_otp";
    $stmt->close();
    $conn->close();
    exit;
}

// Check if the OTP matches
if ($otp != $stored_otp) {
    logDebug("OTP does not match for email: $email");
    echo "invalid_otp";
    $stmt->close();
    $conn->close();
    exit;
}

// Check if the OTP has expired
$current_time = date('Y-m-d H:i:s');
if (strtotime($current_time) > strtotime($expires_at)) {
    logDebug("OTP has expired for email: $email");
    echo "invalid_otp";
    $stmt->close();
    $conn->close();
    exit;
}

// Clear the reset token and expiration
$update_stmt = $conn->prepare("UPDATE users SET reset_token = NULL, reset_expires = NULL WHERE email = ?");
if (!$update_stmt) {
    logDebug("Prepare failed (UPDATE): " . $conn->error);
    echo "sql_error: " . $conn->error;
    $stmt->close();
    $conn->close();
    exit;
}

$update_stmt->bind_param("s", $email);
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
    logDebug("No rows affected - email not found or data unchanged: $email");
    echo "error: No rows affected";
    $update_stmt->close();
    $stmt->close();
    $conn->close();
    exit;
}

$update_stmt->close();
$stmt->close();
$conn->close();

$redirect_url = ($flow == 'signup') ? 'log-in.html' : 'reset-password.html?email=' . urlencode($email);
echo "success:$redirect_url";
logDebug("Finished verify-otp.php");
?>