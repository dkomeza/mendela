<?php
require_once "db.php";
$db = new DB();


$data = json_decode(file_get_contents('php://input'), true);

$alloy = $data['alloy'];
$country = $data['country'];
$currency = $data['currency'];
$no = $data['no'];
$year = $data['year'];
$id = $data['id'];

$new_id = $db->addRecord($alloy, $country, $currency, $no, $year, $id);

echo json_encode(["id" => $new_id]);
