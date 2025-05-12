<?php
session_start();
$_SESSION['user_id'] = $user['id']; // after successful login
$_SESSION['role'] = $user['role'];  // store current role too


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "rental";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_POST['email']) && isset($_POST['password'])) {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];

            // Respond with the role only
            echo $user['role'];
        } else {
            echo "incorrect_password";
        }
    } else {
        echo "user_not_found";
    }

    $stmt->close();
}

$conn->close();
?>
