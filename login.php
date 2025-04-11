<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log function for debugging
function logDebug($message) {
    file_put_contents('debug_login.log', date('Y-m-d H:i:s') . " - " . $message . "\n", FILE_APPEND);
}

logDebug("Starting login.php");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "rental";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    logDebug("Connection failed: " . $conn->connect_error);
    die("db_error: " . $conn->connect_error);
}

if (isset($_POST['email']) && isset($_POST['password'])) {
    $email = strtolower($conn->real_escape_string($_POST["email"])); // Normalize email to lowercase
    $password = $_POST['password'];
    $redirect_to = isset($_POST['redirect_to']) ? $_POST['redirect_to'] : '';

    logDebug("Login attempt: email=$email, redirect_to=$redirect_to");

    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result === false) {
        logDebug("Query failed: " . $conn->error);
        echo "<script>alert('SQL error: " . addslashes($conn->error) . "'); window.location.href = 'log-in.html';</script>";
        $conn->close();
        exit;
    }

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        if (password_verify($password, $row['password'])) {
            $redirect_url = '../bookingpage/booking.html';
            
            if ($redirect_to == 'visitors') {
                $redirect_url = '../visitors/visitors.html';
            } elseif ($redirect_to == 'DeluxeRoom') {
                $redirect_url = '../bookingpage/booking.html';
            } elseif ($redirect_to == 'stays') {
                $redirect_url = '../staysSection/stays.html';
            } elseif ($redirect_to == 'aboutus') {
                $redirect_url = '../aboutusSection/about-us.html';
            }
            
            logDebug("Login successful, redirecting to: $redirect_url");
            echo "<script>alert('Login successful!'); window.location.href = '$redirect_url';</script>";
        } else {
            logDebug("Invalid password for email: $email");
            echo "<script>alert('Invalid email or password!'); window.location.href = 'log-in.html';</script>";
        }
    } else {
        logDebug("Email not found: $email");
        echo "<script>alert('Invalid email or password!'); window.location.href = 'log-in.html';</script>";
    }
} else {
    logDebug("Missing email or password in POST data");
    echo "<script>alert('Please provide email and password!'); window.location.href = 'log-in.html';</script>";
}

$conn->close();
logDebug("Finished login.php");
?>