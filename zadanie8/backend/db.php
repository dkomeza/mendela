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
        $sql = "SELECT `data`.`ID`, `data`.`currency`, `data`.`no`, `data`.`year`, `countries`.`country_name`, `countries`.`country_image`, `alloys`.`alloy_name` FROM `data` JOIN `countries` ON `data`.`country` = `countries`.`country_id` JOIN `alloys` ON `data`.`alloy` = `alloys`.`alloy_id`";
        $result = $this->conn->query($sql);
        $records = array();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $records[] = $row;
            }
        }
        return $records;
    }

    function getAlloys()
    {
        $sql = "SELECT `alloy_name` FROM `alloys`";
        $result = $this->conn->query($sql);
        $records = array();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $records[] = $row;
            }
        }
        return $records;
    }

    function getCountries()
    {
        $sql = "SELECT `country_name`, `country_image` FROM `countries`";
        $result = $this->conn->query($sql);
        $records = array();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $records[] = $row;
            }
        }
        return $records;
    }

    function addRecord($alloy, $country, $currency, $no, $year, $id)
    {
        $sql = "SELECT `alloy_id` FROM `alloys` WHERE `alloy_name` = '$alloy'";
        $result = $this->conn->query($sql);
        $alloy_id = $result->fetch_assoc()['alloy_id'];

        $sql = "SELECT `country_id` FROM `countries` WHERE `country_name` = '$country'";
        $result = $this->conn->query($sql);
        $country_id = $result->fetch_assoc()['country_id'];

        if ($id == 0) {
            $sql = "INSERT INTO `data` (`alloy`, `country`, `currency`, `no`, `year`) VALUES ('$alloy_id', '$country_id', '$currency', '$no', '$year')";
        } else {
            $sql = "UPDATE `data` SET `alloy` = '$alloy_id', `country` = '$country_id', `currency` = '$currency', `no` = '$no', `year` = '$year' WHERE `data`.`ID` = '$id'";
        }
        $this->conn->query($sql);
    }
}
