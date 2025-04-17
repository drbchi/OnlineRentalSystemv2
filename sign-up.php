<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log function for debugging
function logDebug($message) {
    file_put_contents('debug_signup.log', date('Y-m-d H:i:s') . " - " . $message . "\n", FILE_APPEND);
}

logDebug("Starting sign-up.php");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "rental";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    logDebug("Connection failed: " . $conn->connect_error);
    die("db_error: " . $conn->connect_error);
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS rental";
if ($conn->query($sql) !== TRUE) {
    logDebug("Error creating database: " . $conn->error);
    die("db_error: " . $conn->error);
}

$conn->select_db("rental");

// Create users table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
   
)";
if ($conn->query($sql) !== TRUE) {
    logDebug("Error creating table: " . $conn->error);
    die("db_error: " . $conn->error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $conn->real_escape_string($_POST["username"]);
    $email = strtolower($conn->real_escape_string($_POST["email"])); // Normalize email to lowercase
    $pass = password_hash($_POST["password"], PASSWORD_BCRYPT);
    $redirect_to = isset($_POST['redirect_to']) ? $_POST['redirect_to'] : '';

    logDebug("Received data: username=$user, email=$email, redirect_to=$redirect_to");

    // Check if email already exists
    $emailCheckSql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($emailCheckSql);

    if ($result === false) {
        logDebug("Email check failed: " . $conn->error);
        echo "sql_error: " . $conn->error;
        $conn->close();
        exit;
    }

    if ($result->num_rows > 0) {
        logDebug("Email already exists: $email");
        echo "email_exists";
    } else {
        $sql = "INSERT INTO users (username, email, password) VALUES ('$user', '$email', '$pass')";
        if ($conn->query($sql) === TRUE) {
            logDebug("User inserted successfully: $email");
            // Verify the insertion by querying the database
            $verifySql = "SELECT * FROM users WHERE email = '$email'";
            $verifyResult = $conn->query($verifySql);
            if ($verifyResult->num_rows > 0) {
                logDebug("User verified in database: $email");
            } else {
                logDebug("User not found in database after insert: $email");
            }
            // Redirect to login page after successful sign-up
            $redirect_url = 'log-in.html';
            echo "success:$redirect_url";
        } else {
            logDebug("Insert failed: " . $conn->error);
            echo "sql_error: " . $conn->error;
        }
    }
} else {
    logDebug("Invalid request method: " . $_SERVER["REQUEST_METHOD"]);
    echo "invalid_request";
}

$conn->close();
logDebug("Finished sign-up.php");
?>