<?php
session_start();
if(!empty($_SESSION['name'])){
    $bdd = new PDO('mysql:host=remotemysql.com;dbname=lespxweO1Y;charset=utf8', 'lespxweO1Y', 'EAtzAiItZE');

    $safe_name = mysql_real_escape_string($_SESSION['name']);
    $reponse = $bdd->query("
INSERT INTO score (score, name)
VALUES (".$_POST['score'].", ' ". $safe_name."')
ON DUPLICATE KEY UPDATE
score = (CASE 
              WHEN values(score) > score THEN VALUES(score)
         	  ELSE score 
         	  end)
        ");
    echo $_SESSION["name"];
}else{
    echo 'c mor';
}




//echo 'Thank you ' . $_POST['firstname'] . ' ' . $_POST['lastname'] . ', says the PHP file';
