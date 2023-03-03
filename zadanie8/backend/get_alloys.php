<?php
require_once "db.php";
$db = new DB();
$alloys = $db->getAlloys();
echo json_encode($alloys);