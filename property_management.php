<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "rental";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';

switch ($action) {
    case 'create':
        $stmt = $conn->prepare("INSERT INTO properties (name, image, description, price, room_type, capacity, location) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssis", $data['name'], $data['image'], $data['description'], $data['price'], $data['room_type'], $data['capacity'], $data['location']);
        $stmt->execute();
        echo json_encode(["status" => "success", "message" => "Property added successfully"]);
        break;
    
    case 'read':
        $result = $conn->query("SELECT * FROM properties");
        $properties = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($properties);
        break;
    
    case 'update':
        $id = $data['id'] ?? null;
        if (!$id) {
            echo json_encode(["status" => "error", "message" => "Property ID is required"]);
            exit;
        }
        
        $fields = [];
        $values = [];
        
        if (!empty($data['name'])) {
            $fields[] = "name=?";
            $values[] = $data['name'];
        }
        if (!empty($data['description'])) {
            $fields[] = "description=?";
            $values[] = $data['description'];
        }
        if (!empty($data['price'])) {
            $fields[] = "price=?";
            $values[] = $data['price'];
        }
        if (!empty($data['room_type'])) {
            $fields[] = "room_type=?";
            $values[] = $data['room_type'];
        }
        if (!empty($data['capacity'])) {
            $fields[] = "capacity=?";
            $values[] = $data['capacity'];
        }
        if (!empty($data['location'])) {
            $fields[] = "location=?";
            $values[] = $data['location'];
        }
        
        if (empty($fields)) {
            echo json_encode(["status" => "error", "message" => "No fields provided for update"]);
            exit;
        }
        
        $values[] = $id;
        $sql = "UPDATE properties SET " . implode(", ", $fields) . " WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(str_repeat("s", count($fields)) . "i", ...$values);
        $stmt->execute();
        
        echo json_encode(["status" => "success", "message" => "Property updated successfully"]);
        break;
        
    
    case 'delete':
        $stmt = $conn->prepare("DELETE FROM properties WHERE id=?");
        $stmt->bind_param("i", $data['id']);
        $stmt->execute();
        echo json_encode(["status" => "success", "message" => "Property deleted successfully"]);
        break;
    
    default:
        echo json_encode(["status" => "error", "message" => "Invalid action"]);
        break;
}

$conn->close();
?>
