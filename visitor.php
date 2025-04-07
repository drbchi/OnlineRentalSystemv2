<?php
include 'config.php';
$response = array();
$input = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($input['action']) && $input['action'] === 'getrooms') {
        $roomtype = $input['roomtype'] ?? 'all'; 

        if ($roomtype === "all") {
            $sql = "SELECT * FROM room";
        } else {
            $sql = "SELECT * FROM room WHERE roomtype = ?";
        }

        $stmt = $conn->prepare($sql);
        if ($roomtype !== "all") {
            $stmt->bind_param("s", $roomtype);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $rooms = [];
            while ($row = $result->fetch_assoc()) {
                $rooms[] = $row;
            }
            echo json_encode(["status" => 200, "message" => "Rooms fetched successfully", "data" => $rooms]);
        } else {
            echo json_encode(["status" => 400, "message" => "No rooms found"]);
        }

        $stmt->close();
    } else {
        echo json_encode(["status" => 400, "message" => "Invalid action"]);
    }
} else {
    echo json_encode(["status" => 405, "message" => "Method not allowed"]);
}
?>
