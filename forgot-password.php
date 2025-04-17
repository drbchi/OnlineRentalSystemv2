<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set the timezone explicitly
date_default_timezone_set('Asia/Kolkata');

// Log function for debugging
function logDebug($message) {
    file_put_contents('debug_forgot_password.log', date('Y-m-d H:i:s') . " - " . $message . "\n", FILE_APPEND);
}

logDebug("Starting forgot-password.php");

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

if (!isset($_POST["email"])) {
    logDebug("Missing email in POST request");
    echo "missing_email";
    $conn->close();
    exit;
}

// Normalize email to lowercase
$email = strtolower($conn->real_escape_string($_POST["email"]));
logDebug("Received email (normalized): $email");

// Check if email exists
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

// Generate a 6-digit OTP
$otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
logDebug("Generated OTP: $otp");

// Calculate expiration time
$expires_at = date('Y-m-d H:i:s', strtotime('+10 minutes'));
logDebug("Calculated expires_at: $expires_at");

// Update the database
$update_stmt = $conn->prepare("UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?");
if (!$update_stmt) {
    logDebug("Prepare failed (UPDATE): " . $conn->error);
    echo "sql_error: " . $conn->error;
    $stmt->close();
    $conn->close();
    exit;
}

$update_stmt->bind_param("sss", $otp, $expires_at, $email);
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

// Verify the update
$verify_stmt = $conn->prepare("SELECT reset_token, reset_expires FROM users WHERE email = ?");
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

logDebug("Database verification - reset_token: " . $verify_row['reset_token'] . ", reset_expires: " . $verify_row['reset_expires']);

if ($verify_row['reset_token'] != $otp || $verify_row['reset_expires'] != $expires_at) {
    logDebug("Verification failed: Stored values do not match expected values");
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

// Create the OTP link
$otp_link = "http://localhost/Security/loginANDsignup/verify-otp.html?email=" . urlencode($email) . "&flow=forgot";
echo "success: OTP has been 'sent' to $email. Your OTP is: $otp (Link: $otp_link). This OTP expires in 10 minutes.";
logDebug("Finished forgot-password.php");
?>