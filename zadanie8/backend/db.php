<?php
class DB
{
    private $conn;
    function __construct()
    {
        $this->conn = new mysqli("127.0.0.1", "root", "SuperHaslo123", "Mendela8");
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    function __destruct()
    {
        $this->conn->close();
    }

    function getRecords()
    {
        $sql = "SELECT * FROM `records`";
        $result = $this->conn->query($sql);
        $records = array();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $records[] = $row;
            }
        }
        return $records;
    }

    function addRecord()
    {
    }
}
