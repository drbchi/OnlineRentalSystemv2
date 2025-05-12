<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "rental";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = trim($_POST["username"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];
    $role = $_POST["role"];

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "invalid_email";
        exit;
    }

    // Validate password length
    if (strlen($password) < 6) {
        echo "weak_password";
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo "email_exists";
        $stmt->close();
        $conn->close();
        exit;
    }
    $stmt->close();

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $user, $email, $hashedPassword, $role);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Database error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>
