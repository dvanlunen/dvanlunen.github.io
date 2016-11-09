<?php

$mysql_hostname = "127.0.0.1";
$mysql_username = "root";
$mysql_password = "DNFw6DqdEErASfvq";
$mysql_database = "DVL Loves Dogs";
$ dv - mysql_connect($mysql_hostname, $mysql_username, $mysql_password)
or die("Error");

mysql_select_db($mysql_database, $db) or die("Couldn't find datebase");

?>