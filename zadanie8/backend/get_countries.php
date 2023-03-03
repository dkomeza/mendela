<?php
require_once "db.php";
$db = new DB();
$countries = $db->getCountries();
echo json_encode($countries);
