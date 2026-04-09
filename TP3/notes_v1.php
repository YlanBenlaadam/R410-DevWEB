<?php
/* =====================================================================
   TP3 - notes_v1.php
   ---------------------------------------------------------------------
   A QUOI SERT CE FICHIER ?
   ---------------------------------------------------------------------
   C'est un script PHP qui s'execute sur le SERVEUR (webdev).
   Quand le navigateur fait une requete fetch("./notes_v1.php"),
   le serveur execute ce code et renvoie au navigateur le TEXTE
   produit par les "echo" du script (ici du JSON).

   RESULTAT RENVOYE :
   Un document JSON qui ressemble a ceci :
       {
         "colonnes": ["Autodiscipline","Elementalisme",...,"Artisant"],
         "lignes": [
            ["Shongu", 10, 6, 15, 7, 14, 11, 17, 15, 14],
            ["Woshrog", 5, 16, 9, 8, 12, 5, 7, 10, 18],
            ...
         ]
       }

   COTE JS :
   Le navigateur recoit ce JSON, puis la fonction
   get_table_in_desktop_view() ou get_table_in_mobile_view() s'en
   sert pour CONSTRUIRE le tableau HTML.

   POURQUOI CE FORMAT PRECIS ?
   Parce que les fonctions JS attendent deja un objet avec
   .colonnes et .lignes. On n'a donc AUCUNE transformation a faire
   cote client : on lit les donnees et on les met directement dans
   le DOM.
   ===================================================================== */


/* ---------------------------------------------------------------------
   header() = fonction PHP qui envoie un ENTETE HTTP au navigateur.
   ---------------------------------------------------------------------
   Ici on dit au navigateur : "la reponse que je vais t'envoyer est
   du JSON encode en UTF-8". C'est important car :
     - sans ca, le navigateur croirait que c'est du HTML et
       essaierait de l'afficher bizarrement
     - avec ca, fetch().then(r => r.json()) fonctionne parfaitement

   EXEMPLE de ce qui est envoye AVANT le corps de la reponse :
       HTTP/1.1 200 OK
       Content-Type: application/json; charset=utf-8
       (ligne vide)
       { "colonnes": [...], "lignes": [...] }
   --------------------------------------------------------------------- */
header('Content-Type: application/json; charset=utf-8');


/* ---------------------------------------------------------------------
   1) DEFINITION DES DISCIPLINES (LES COLONNES DU TABLEAU)
   ---------------------------------------------------------------------
   $disciplines est une VARIABLE PHP (le $ est obligatoire en PHP
   devant toutes les variables). Elle contient un TABLEAU INDEXE
   (en PHP on dit "array") avec les 9 disciplines magiques.

   La syntaxe [ ... ] est la syntaxe courte des tableaux PHP,
   equivalente a array(...) qui est l'ancienne syntaxe.

   EXEMPLE D'ACCES :
       echo $disciplines[0];  // affichera "Autodiscipline"
       count($disciplines);   // renvoie 9
   --------------------------------------------------------------------- */
$disciplines = [
    "Autodiscipline",   // col 0 - famille Psionisme
    "Elementalisme",    // col 1 - famille Essence
    "Naturalisme",      // col 2 - famille Essence
    "Divination",       // col 3 - famille Canalisation
    "Pretrise",         // col 4 - famille Canalisation
    "Alteration",       // col 5 - famille Mentalisme
    "Conscience",       // col 6 - famille Mentalisme
    "Guerrier",         // col 7 - famille Hybridation
    "Artisant"          // col 8 - famille Hybridation
];


/* ---------------------------------------------------------------------
   2) LISTE DES NOMS DE MAGES POSSIBLES
   ---------------------------------------------------------------------
   Pour generer un tableau "realiste", on pioche des noms dans une
   liste. On en met PLUS QUE 15 car on va en tirer au maximum 15
   (et on veut pouvoir piocher sans doublon).

   EXEMPLE :
       Si on a besoin de 7 noms, on melange la liste avec shuffle(),
       puis on prend les 7 premiers : $noms_possibles[0..6].
   --------------------------------------------------------------------- */
$noms_possibles = [
    "Lord totor", "Woshrog", "Shongu", "Adelakai", "Ill'an Louk",
    "Ahchmaradim", "Grodalf le fruit", "Garcimore", "Houquilni",
    "Gobeurfined", "Hairy Ploter", "Zsacham", "Merlinus", "Zorglub",
    "Mandrakor", "Nostradamix", "Tiresias", "Melusine", "Drakarys",
    "Cassandra"
];


/* ---------------------------------------------------------------------
   3) TIRAGE DU NOMBRE DE MAGES (entre 5 et 15 inclus)
   ---------------------------------------------------------------------
   rand($min, $max) est une fonction PHP qui renvoie un entier
   aleatoire dans l'intervalle [$min ; $max] (bornes incluses).

   EXEMPLE : rand(5, 15) peut renvoyer 5, 6, 7, ... ou 15.
   --------------------------------------------------------------------- */
$nb_mages = rand(5, 15);


/* ---------------------------------------------------------------------
   4) MELANGE DES NOMS POUR EVITER LES DOUBLONS
   ---------------------------------------------------------------------
   shuffle($array) melange le tableau "en place" (= le tableau est
   modifie directement, il n'y a pas de valeur de retour utile).
   Resultat : l'ordre des noms est imprevisible.

   EXEMPLE :
       Avant : ["Lord totor","Woshrog","Shongu",...]
       Apres : ["Zorglub","Shongu","Cassandra","Lord totor",...]
   --------------------------------------------------------------------- */
shuffle($noms_possibles);


/* ---------------------------------------------------------------------
   5) CONSTRUCTION DE LA LISTE DES LIGNES
   ---------------------------------------------------------------------
   On cree un tableau vide $lignes qui va accumuler les lignes.
   Chaque ligne sera un tableau au format :
       [ "nom_du_mage", note_discipline_0, note_discipline_1, ..., note_discipline_8 ]

   On fait donc une BOUCLE for sur les mages (de 0 a $nb_mages - 1).
   Pour chaque mage, on construit une ligne et on l'ajoute a $lignes.

   EXEMPLE de $lignes en fin de boucle :
       [
         ["Shongu",   10, 6, 15, 7, 14, 11, 17, 15, 14],
         ["Woshrog",   5, 16, 9, 8, 12, 5, 7, 10, 18],
         ["Drakarys", 18, 13, 7, 11, 9, 16, 12, 14, 10]
       ]
   --------------------------------------------------------------------- */
$lignes = [];  // tableau vide au depart

// Boucle for classique : $i va de 0 a $nb_mages - 1
for ($i = 0; $i < $nb_mages; $i++) {

    // On commence la ligne avec le NOM du mage en case 0
    // $noms_possibles[$i] = le i-eme nom (du tableau deja melange)
    $ligne = [ $noms_possibles[$i] ];

    // Puis on ajoute UNE NOTE par discipline.
    // foreach parcourt TOUS les elements d'un tableau.
    // La valeur courante (la discipline) est placee dans $d.
    foreach ($disciplines as $d) {
        // $ligne[] = XXX est la syntaxe PHP pour "ajouter XXX a la fin du tableau"
        // equivalent a array_push($ligne, XXX);
        // rand(0,20) = une note entiere aleatoire entre 0 et 20
        $ligne[] = rand(0, 20);
    }

    // On ajoute la ligne complete (nom + 9 notes) au tableau global
    $lignes[] = $ligne;
}


/* ---------------------------------------------------------------------
   6) CONSTRUCTION DE L'OBJET REPONSE
   ---------------------------------------------------------------------
   On cree un TABLEAU ASSOCIATIF PHP. Dans un tableau associatif,
   chaque valeur est associee a une CLE (comme un objet JS).

   La syntaxe est :
       [ "cle1" => valeur1, "cle2" => valeur2 ]

   Cote JS, apres json_encode, cela donnera un VRAI objet JS :
       { colonnes: [...], lignes: [...] }

   C'est exactement ce qu'on veut recevoir cote client.
   --------------------------------------------------------------------- */
$reponse = [
    "colonnes" => $disciplines,  // les 9 disciplines
    "lignes"   => $lignes        // les N mages et leurs notes
];


/* ---------------------------------------------------------------------
   7) ECRITURE DU JSON DANS LA REPONSE HTTP
   ---------------------------------------------------------------------
   json_encode($var) transforme une variable PHP en TEXTE JSON.
   echo envoie ce texte dans le corps de la reponse HTTP.

   JSON_UNESCAPED_UNICODE est une OPTION qui empeche json_encode
   d'echapper les caracteres accentues en \uXXXX. Grace a ca,
   "Pretrise" reste lisible au lieu de "Pr\u00e8trise".

   EXEMPLE de sortie reelle :
       {"colonnes":["Autodiscipline","Elementalisme",...],"lignes":[["Shongu",10,6,...]]}
   --------------------------------------------------------------------- */
echo json_encode($reponse, JSON_UNESCAPED_UNICODE);
