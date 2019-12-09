<?php

if (isset($_POST['name'])){
    session_start();
    $_SESSION['name'] = $_POST['name'];

} ?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Orb'it</title>
    <style>
      body {
        margin: 0;
        background: #00003f;
        overflow: hidden;
      }
    </style>

  </head>
  <body>

    <canvas></canvas>
    <script src="src/js/canvas.js"></script>

  </body>
</html>
