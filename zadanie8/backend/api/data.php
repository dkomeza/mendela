<?php 
include("../db.php"); //require
$db = new DB();
echo json_encode($db->getRecords());
