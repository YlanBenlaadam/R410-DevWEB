<?php
/* =====================================================================
   notes_v1.php
   ---------------------------------------------------------------------
   RÔLE :
   Ce script PHP est exécuté par le serveur webdev. Son but est de
   produire (côté serveur) un document JSON contenant :
     - une liste fixe de disciplines (les colonnes du tableau)
     - une liste de mages (les lignes), dont la taille est ALÉATOIRE
     - pour chaque mage, une liste de notes ALÉATOIRES (entier entre 0 et 20)

   Le fichier final (une fois consulté via HTTP) ressemble à ceci :
   {
     "colonnes": ["Autodiscipline", ...],
     "lignes": [
        ["Grodalf", 12, 5, 18, ...],
        ["Shongü",   7, 9, 14, ...],
        ...
     ]
   }

   IMPORTANT :
   - On renvoie du JSON PUR (pas de HTML).
   - Le header Content-Type indique au navigateur que la réponse est
     du JSON (utile pour le fetch côté JS).
   - À chaque rechargement de la page, le tableau change, ce qui
     permet de vérifier dans le TP que "un second clic charge bien
     de nouvelles données".
   ===================================================================== */

// On indique au navigateur/client que la réponse renvoyée est
// du JSON encodé en UTF-8. C'est la même notion que 'content-type' en
// HTTP : sans cette ligne, le navigateur pourrait interpréter la
// réponse comme du texte brut ou du HTML.
header('Content-Type: application/json; charset=utf-8');

/* ---------------------------------------------------------------------
   1) LES COLONNES (les disciplines magiques)
   ---------------------------------------------------------------------
   On définit ici une liste FIXE de disciplines. C'est exactement la
   même liste que dans le TP2. Elles correspondent aux colonnes du
   tableau (hors la colonne des noms des mages).
   --------------------------------------------------------------------- */
$disciplines = [
    "Autodiscipline",   // Psionisme
    "Elementalisme",    // Essence
    "Naturalisme",      // Essence
    "Divination",       // Canalisation
    "Prètrise",         // Canalisation
    "Altération",       // Mentalisme
    "Conscience",       // Mentalisme
    "Guerrier",         // Hybridation
    "Artisant"          // Hybridation
];

/* ---------------------------------------------------------------------
   2) LES NOMS DE MAGES POSSIBLES
   ---------------------------------------------------------------------
   On prépare un petit "catalogue" de noms dans lequel on va piocher
   aléatoirement. On en a plus que 15 pour être sûr d'avoir assez de
   noms différents même dans le pire cas (on va générer entre 5 et 15
   mages).
   --------------------------------------------------------------------- */
$noms_possibles = [
    "Lord totor", "Woshrog", "Shongü", "Adelakaï", "Ill'an Louk",
    "Ahchmaradim", "Grodalf le fruit", "Garcimore", "Houquilni",
    "Gobeurfined", "Hairy Ploter", "Zsächam", "Merlinus", "Zorglub",
    "Mandrakor", "Nostradamix", "Tirésias", "Mélusine", "Drakarys",
    "Cassandra"
];

/* ---------------------------------------------------------------------
   3) LES LIGNES DU TABLEAU
   ---------------------------------------------------------------------
   On va construire un tableau PHP qui, une fois converti en JSON
   via json_encode, donnera quelque chose comme :
      [
        ["Shongü",   10, 6, 15, 7, 14, ...],
        ["Woshrog",   5, 16, 9, 8, 12, ...],
        ...
      ]

   ÉTAPES :
     a) On choisit un nombre aléatoire de mages entre 5 et 15.
     b) On mélange la liste de noms pour ne pas avoir de doublons.
     c) Pour chaque mage, on crée une ligne :
          - 1ère case = le nom
          - ensuite = une note aléatoire par discipline
     d) On accumule ces lignes dans $lignes.
   --------------------------------------------------------------------- */

// a) nombre aléatoire de mages (entier entre 5 et 15 inclus)
// rand(min, max) renvoie un entier aléatoire entre min et max inclus
$nb_mages = rand(5, 15);

// b) shuffle() mélange le tableau en place. Cela évite d'avoir
//    plusieurs fois le même nom si on pioche au hasard.
shuffle($noms_possibles);

// c) on prépare la liste des lignes (vide au départ)
$lignes = [];

for ($i = 0; $i < $nb_mages; $i++) {
    // On commence la ligne par le nom du mage (1re colonne du tableau)
    $ligne = [ $noms_possibles[$i] ];

    // Ensuite, pour chaque discipline, on tire une note entière
    // entre 0 et 20 et on l'ajoute à la ligne.
    foreach ($disciplines as $d) {
        $ligne[] = rand(0, 20);
    }

    // On ajoute la ligne complète (nom + 9 notes) au tableau $lignes.
    $lignes[] = $ligne;
}

/* ---------------------------------------------------------------------
   4) ASSEMBLAGE FINAL ET SORTIE JSON
   ---------------------------------------------------------------------
   Le JS côté client va faire un fetch vers ce fichier. Il va
   recevoir un objet avec DEUX propriétés :
     - colonnes : la liste des disciplines
     - lignes   : la liste des lignes (chaque ligne = nom + 9 notes)

   echo envoie le texte produit par json_encode dans le corps de la
   réponse HTTP. C'est ce que recevra le fetch().

   JSON_UNESCAPED_UNICODE évite que les accents soient encodés en
   séquences \uXXXX et garde donc 'Prètrise' lisible.
   --------------------------------------------------------------------- */
$reponse = [
    "colonnes" => $disciplines,
    "lignes"   => $lignes
];

echo json_encode($reponse, JSON_UNESCAPED_UNICODE);
