<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" href="flavicon.png" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <meta charset="UTF-8">
    <title>Orbit - Les regles</title>
    <style>
        body {
            margin: 0;
            background: #00003f;

        }
    </style>
</head>
<body>
<center>
    <img id="regles" src="src/reglesOrbit.png"
         width="600" height="600" style="z-index: 5; margin-top: 100px" ><br>
   
    <form action="orbit.php" method="post">
        <div class="input-group flex-nowrap" style="width: 15%">
            <div class="input-group-prepend">
                <span class="input-group-text" id="addon-wrapping">Pseudo : </span>
            </div>
            <input type="text" class="form-control" placeholder="LeBossDu91" aria-label="Username" aria-describedby="addon-wrapping" name="name" >
            <button type="submit" class="btn btn-primary">Jouer</button>
        </div>
        <br />

    </form>
 <br><br><br>
    <h2 style="color: white">Tableau des scores Officiel</h2>

<?php


$bdd = new PDO('mysql:host=remotemysql.com;dbname=lespxweO1Y;charset=utf8', 'lespxweO1Y', 'EAtzAiItZE');

$query = $bdd->query("SELECT * FROM score ORDER BY score DESC");



echo '<table class="table table-dark" style="width: 50%; margin: 2%">'."\n";
    // première ligne on affiche les titres prénom et surnom dans 2 colonnes
    echo '<tr class="class01">';
        echo '<td>Position</td>';
        echo '<td>Pseudo</td>';
        echo '<td>Score</td>';
        echo '</tr>'."\n";

    // Partie "Boucle"
    // lecture et affichage des résultats sur 2 colonnes, 1 résultat par ligne.
    $i = 0;
    while($element= $query -> fetch()) {
        $i++;

    echo '<tr class="class02">';
        echo '<td class="ID">'.$i.'</td>';
        echo '<td class="ID">'.$element['name'].'</td>';
        echo '<td class="Patient">'.$element['score'].'</td>';
        echo '</tr>'."\n";
    }
    echo '</table>'."\n"; ?>
</center>
</body>
</html>