<?php
require_once "db.php";
$db = new DB();

$data = json_decode(file_get_contents('php://input'), true);

$id = $data["id"];

$db->deleteRecord($id);

echo json_encode(["message" => "ok"]);