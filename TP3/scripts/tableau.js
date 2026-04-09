/* =====================================================================
   TP3 - tableau.js
   ---------------------------------------------------------------------
   CE QUI CHANGE PAR RAPPORT AU TP2 :
   - On NE LIT PLUS le tableau HTML pour en tirer les donnees.
     Au contraire, on RECUPERE les donnees depuis le SERVEUR (webdev)
     via fetch(), puis on CONSTRUIT le tableau HTML a partir de ces
     donnees.
   - Il y a deux sources possibles :
        1) notes_v1.php  -> renvoie un JSON deja au bon format
                            (objet avec .colonnes et .lignes)
        2) data.json     -> renvoie un JSON dans un format DIFFERENT
                            (avec .disciplines et .premiere_annee).
                            Dans ce cas on doit ADAPTER la structure
                            avec adaptateur_contenu(json) ou
                            adaptateur_contenu_vproxy(json).

   DEUX FONCTIONS PRINCIPALES :
     - get_table_in_desktop_view(id_table)  : affichage classique
     - get_table_in_mobile_view(id_table)   : affichage mobile

   Elles sont invoquees directement par onclick dans le HTML.
   ===================================================================== */


/* ---------------------------------------------------------------------
   CONFIGURATION : d'ou viennent les donnees ?
   ---------------------------------------------------------------------
   On met l'URL du script PHP dans une constante pour pouvoir la
   changer facilement. Par defaut, le fichier .php est dans le meme
   dossier que le tableau.html, donc on utilise un chemin relatif.
   --------------------------------------------------------------------- */
const URL_NOTES_PHP = "./notes_v1.php";   // exercice 1 : PHP qui renvoie deja .colonnes + .lignes
const URL_DATA_JSON = "./data.json";      // exercice 2 : JSON brut (.disciplines + .premiere_annee)

/* Pour activer l'exercice 2 (travailler avec data.json et l'adaptateur),
   on bascule ce flag a true. Si false, on utilise notes_v1.php. */
const UTILISER_ADAPTATEUR = false;

/* Si UTILISER_ADAPTATEUR est true, on peut choisir entre la version
   "copie" (adaptateur_contenu) et la version "proxy"
   (adaptateur_contenu_vproxy). */
const UTILISER_PROXY = true;


/* =====================================================================
   EXERCICE 1 - FETCH ET CONSTRUCTION (notes_v1.php)
   ===================================================================== */

/* ---------------------------------------------------------------------
   get_table_in_desktop_view(id_table)
   ---------------------------------------------------------------------
   Etapes :
     1) On recupere la <table> par son id.
     2) On fait un fetch() vers la source de donnees (PHP ou JSON).
     3) On transforme la reponse en JSON JS (.json()).
     4) Si on est en mode adaptateur, on adapte le json.
     5) On vide la table (au cas ou il y aurait deja des choses).
     6) On construit le thead et le tbody a partir de .colonnes et
        .lignes.

   RAPPEL SUR fetch :
     fetch(url) renvoie une Promise (un objet qui represente un
     resultat futur). On y attache des .then() pour reagir quand la
     reponse arrive. La premiere .then() recoit un objet Response,
     dont .json() renvoie ENCORE une promesse (d'ou le second .then()).
   --------------------------------------------------------------------- */
function get_table_in_desktop_view(id_table) {

    // 1) on recupere la table HTML sur laquelle on va travailler
    const el_table = document.getElementById(id_table);

    // 2) on choisit la source (PHP ou data.json selon la config)
    const url = UTILISER_ADAPTATEUR ? URL_DATA_JSON : URL_NOTES_PHP;

    // 3) on declenche la requete HTTP
    fetch(url)
        // 4) premier .then : la reponse est arrivee, on la convertit en JSON.
        //    reponse.json() renvoie ELLE AUSSI une promesse, donc on
        //    la "chaine" au .then suivant.
        .then(reponse => reponse.json())

        // 5) second .then : on a enfin l'objet JS utilisable (json)
        .then(json => {
            // Trace dans la console pour verifier ce qu'on a recu.
            // A COMMENTER une fois que tout fonctionne, mais c'est
            // TRES utile pour debug.
            console.log("Donnees recues du serveur :", json);

            // Si on est en mode adaptateur, on transforme le json brut
            // en un objet qui repond a .colonnes / .lignes comme attendu.
            let contenu = json;
            if (UTILISER_ADAPTATEUR) {
                contenu = UTILISER_PROXY
                    ? adaptateur_contenu_vproxy(json)
                    : adaptateur_contenu(json);
            }

            // 6) on vide entierement la table (caption, ancien thead/tbody...)
            //    firstChild renvoie le premier enfant du noeud. On boucle
            //    tant qu'il y en a un pour tout retirer.
            while (el_table.firstChild != null) {
                el_table.removeChild(el_table.firstChild);
            }

            // 7) on construit la ligne d'entete (thead) a partir de .colonnes
            const thead = document.createElement("thead");      // <thead>
            const trHead = document.createElement("tr");        // <tr> dans le thead

            // Premiere case vide : elle sera au-dessus de la colonne des noms de mages
            trHead.appendChild(document.createElement("th"));

            // Pour chaque discipline, on cree un <th> avec son nom
            for (let i = 0; i < contenu.colonnes.length; i++) {
                const th = document.createElement("th");
                th.innerText = contenu.colonnes[i];
                trHead.appendChild(th);
            }

            thead.appendChild(trHead);
            el_table.appendChild(thead);

            // 8) on construit le tbody a partir de .lignes
            const tbody = document.createElement("tbody");      // <tbody>

            // .lignes.length = nombre de mages
            for (let i = 0; i < contenu.lignes.length; i++) {
                const tr = document.createElement("tr");        // une ligne = un mage

                // IMPORTANT : dans la reponse de notes_v1.php, chaque
                // ligne a la forme [nom, note1, note2, ..., note9].
                // Donc la case 0 = nom, et les cases 1..9 = notes.
                const ligne = contenu.lignes[i];

                // La premiere cellule (le nom du mage) est un <th>
                const thNom = document.createElement("th");
                thNom.innerText = ligne[0];
                tr.appendChild(thNom);

                // Les cellules suivantes (les notes) sont des <td>
                for (let j = 1; j < ligne.length; j++) {
                    const td = document.createElement("td");
                    td.innerText = ligne[j];
                    tr.appendChild(td);
                }

                tbody.appendChild(tr);
            }

            el_table.appendChild(tbody);
        })

        // 9) si une erreur se produit (reseau, JSON invalide, etc.)
        //    on l'affiche dans la console. Le .catch attrape toute
        //    erreur survenue dans la chaine de .then precedente.
        .catch(err => {
            console.error("Erreur lors du fetch :", err);
        });
}


/* ---------------------------------------------------------------------
   get_table_in_mobile_view(id_table)
   ---------------------------------------------------------------------
   Meme principe mais pour le rendu "mobile" :
     - le tableau a 2 colonnes : discipline | note
     - pour chaque mage, on ecrit un bloc de 9 lignes (une par discipline).

   On REUTILISE exactement le meme fetch, seule la partie "construction
   HTML" change.
   --------------------------------------------------------------------- */
function get_table_in_mobile_view(id_table) {

    const el_table = document.getElementById(id_table);
    const url = UTILISER_ADAPTATEUR ? URL_DATA_JSON : URL_NOTES_PHP;

    fetch(url)
        .then(reponse => reponse.json())
        .then(json => {
            console.log("Donnees recues (mobile) :", json);

            let contenu = json;
            if (UTILISER_ADAPTATEUR) {
                contenu = UTILISER_PROXY
                    ? adaptateur_contenu_vproxy(json)
                    : adaptateur_contenu(json);
            }

            // On vide la table, y compris le <caption> du depart
            while (el_table.firstChild != null) {
                el_table.removeChild(el_table.firstChild);
            }

            // Ajout d'une classe "mobile" pour pouvoir styler differemment
            el_table.classList.add("mobile");

            // --- Entete : 2 colonnes "Discipline" et "Notes" ---
            const thead = document.createElement("thead");
            const trHead = document.createElement("tr");
            const th1 = document.createElement("th");
            const th2 = document.createElement("th");
            th1.innerText = "Discipline";
            th2.innerText = "Notes";
            trHead.appendChild(th1);
            trHead.appendChild(th2);
            thead.appendChild(trHead);
            el_table.appendChild(thead);

            // --- Corps : pour chaque mage, 9 lignes (discipline / note) ---
            const tbody = document.createElement("tbody");

            // On parcourt chaque mage
            for (let i = 0; i < contenu.lignes.length; i++) {
                const ligne = contenu.lignes[i];

                // ligne[0] = nom du mage
                // On ajoute une "ligne d'entete" qui contient le nom du mage
                // pour savoir a qui appartiennent les notes qui suivent.
                const trNom = document.createElement("tr");
                const thNom = document.createElement("th");
                thNom.setAttribute("colspan", "2");
                thNom.innerText = ligne[0];
                trNom.appendChild(thNom);
                tbody.appendChild(trNom);

                // Puis on ecrit une ligne par discipline
                for (let j = 0; j < contenu.colonnes.length; j++) {
                    const tr = document.createElement("tr");

                    // Alternance de couleurs (classe ligne1 / ligne2)
                    // j % 2 === 0  ->  indice pair  ->  ligne1
                    tr.classList.add(j % 2 === 0 ? "ligne1" : "ligne2");

                    const th = document.createElement("th");
                    const td = document.createElement("td");

                    // Colonne gauche : la discipline
                    th.innerText = contenu.colonnes[j];
                    // Colonne droite : la note du mage i pour la discipline j
                    // ATTENTION au decalage : ligne[0] est le nom, donc la
                    // note de la discipline j est a l'indice (j + 1).
                    td.innerText = ligne[j + 1];

                    tr.appendChild(th);
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                }
            }

            el_table.appendChild(tbody);
        })
        .catch(err => {
            console.error("Erreur lors du fetch (mobile) :", err);
        });
}


/* =====================================================================
   EXERCICE 2 - ADAPTATEUR ENTRE data.json ET NOS FONCTIONS
   ---------------------------------------------------------------------
   RAPPEL DU PROBLEME :
     data.json est au format :
       {
         disciplines : [...],           // liste des disciplines
         premiere_annee : [              // liste des mages
            { nom, phoneNumber, ..., notes: [...] },
            ...
         ]
       }

     Or nos fonctions attendent un objet avec :
       .colonnes  -> la liste des disciplines
       .lignes    -> une liste de lignes, chaque ligne etant
                     [nom_mage, note1, note2, ..., note9]

   Il faut donc une etape de conversion.
   ===================================================================== */


/* ---------------------------------------------------------------------
   VERSION 1 : adaptateur_contenu(json)
   ---------------------------------------------------------------------
   Cette version est la plus SIMPLE a comprendre : on CREE un nouvel
   objet et on RECOPIE les donnees dedans. Les deux objets (json brut
   et objet adapte) coexistent en memoire.

   Cela marche bien, mais ca utilise plus de memoire puisqu'on
   duplique les donnees.
   --------------------------------------------------------------------- */
function adaptateur_contenu(json) {

    // On cree un objet vide qui deviendra notre resultat
    const contenu = {};

    // .colonnes = la liste des disciplines (on la copie telle quelle)
    // .slice() cree une copie du tableau (bonne pratique pour ne pas
    // partager la reference avec le json d'origine).
    contenu.colonnes = json.disciplines.slice();

    // .lignes = pour chaque mage, on construit un tableau
    //           [nom, note1, note2, ..., note9]
    contenu.lignes = [];

    for (let i = 0; i < json.premiere_annee.length; i++) {
        const mage = json.premiere_annee[i];

        // On commence la ligne par le nom, puis on concatene les notes
        // Array.prototype.concat ajoute les elements d'un tableau a
        // la suite : ["Aldwin"].concat([12,7,18]) -> ["Aldwin",12,7,18]
        const ligne = [mage.nom].concat(mage.notes);

        contenu.lignes.push(ligne);
    }

    return contenu;
}


/* ---------------------------------------------------------------------
   VERSION 2 : adaptateur_contenu_vproxy(json)
   ---------------------------------------------------------------------
   Cette version est PLUS AVANCEE. Au lieu de recopier les donnees,
   elle renvoie un OBJET PROXY qui "fait semblant" d'avoir les
   proprietes .colonnes et .lignes, et qui va chercher les donnees
   dans le json UNIQUEMENT AU MOMENT de la lecture.

   AVANTAGES :
     - Pas de duplication de donnees en memoire
     - Le json original reste intact

   ---------------------------------------------------------------------
   QU'EST-CE QU'UN PROXY EN JAVASCRIPT ?
   ---------------------------------------------------------------------
   Un Proxy est un OBJET SPECIAL qui INTERCEPTE les acces a un autre
   objet. On lui fournit :
     - une "cible" (target) : un objet quelconque, souvent {}
     - un "handler" : un objet contenant des fonctions appelees
       "traps" (get, set, has, deleteProperty, ...)

   Quand on fait proxy.X, JavaScript appelle handler.get(target, "X").
   C'est nous qui decidons QUOI renvoyer.

   ---------------------------------------------------------------------
   POURQUOI UN PROXY DE PROXY ?
   ---------------------------------------------------------------------
   On veut simuler a la fois :
     - contenu.colonnes.length            (.colonnes doit avoir .length)
     - contenu.colonnes[3]                (.colonnes[3] = une discipline)
     - contenu.lignes.length              (.lignes doit avoir .length)
     - contenu.lignes[2]                  (.lignes[2] = une ligne entiere)
     - contenu.lignes[2][5]               (.lignes[2][5] = une note)

   On ne peut pas enumerer a l'avance tous les indices possibles.
   Donc .colonnes et .lignes doivent elles-memes etre des Proxys qui
   interceptent n'importe quel nom d'acces ("length" ou "0" ou "17").

   Et pour .lignes[i], il faut ENCORE un niveau de Proxy : car quand
   on fait lignes[i], on doit obtenir un objet qui, lui aussi,
   supporte [j] et .length.

   Resultat : on a un Proxy qui cree des Proxy qui creent des Proxy.
   --------------------------------------------------------------------- */
function adaptateur_contenu_vproxy(json) {

    // --- Petit helper : Proxy qui simule .colonnes -------------------
    // Il doit repondre a "length" et a n'importe quel indice "0","1",...
    // Quand on ecrit proxy[0], JavaScript appelle get(target, "0").
    // Le nom "prop" est TOUJOURS une CHAINE (meme pour les nombres).
    const proxy_colonnes = new Proxy({}, {
        get(target, prop) {
            // Cas 1 : on demande .length
            //   -> on renvoie la taille du tableau json.disciplines
            if (prop === "length") {
                return json.disciplines.length;
            }

            // Cas 2 : on demande un indice (ex: colonnes[3])
            //   -> on renvoie la discipline correspondante
            //   Number(prop) transforme "3" en 3.
            return json.disciplines[Number(prop)];
        }
    });

    // --- Proxy qui simule UNE ligne -----------------------------------
    // Une ligne doit repondre a :
    //    ligne.length      -> nombre d'elements (1 nom + N notes)
    //    ligne[0]          -> le nom du mage
    //    ligne[j]  (j>0)   -> la note j-1
    //
    // On a besoin de savoir de quel mage on parle, donc on passe
    // l'indice de la ligne (i) en parametre a cette fonction fabrique.
    function faire_proxy_ligne(i) {
        const mage = json.premiere_annee[i];

        return new Proxy({}, {
            get(target, prop) {
                // ligne.length = 1 (pour le nom) + nb de notes
                if (prop === "length") {
                    return 1 + mage.notes.length;
                }

                // On transforme prop (qui est une chaine) en nombre
                const idx = Number(prop);

                // ligne[0] = le nom du mage
                if (idx === 0) {
                    return mage.nom;
                }

                // ligne[1..N] = les notes (decalage de 1 a cause du nom)
                return mage.notes[idx - 1];
            }
        });
    }

    // --- Proxy qui simule .lignes -------------------------------------
    // .lignes doit repondre a :
    //    lignes.length      -> nombre de mages
    //    lignes[i]          -> UNE ligne (qui est elle-meme un Proxy !)
    const proxy_lignes = new Proxy({}, {
        get(target, prop) {
            if (prop === "length") {
                return json.premiere_annee.length;
            }

            // On construit A LA VOLEE un Proxy pour la ligne demandee
            // (on ne stocke rien : c'est recalcule a chaque acces).
            return faire_proxy_ligne(Number(prop));
        }
    });

    // --- Proxy racine : c'est lui qu'on renvoie -----------------------
    // Il intercepte uniquement deux proprietes :
    //   .colonnes  ->  proxy_colonnes
    //   .lignes    ->  proxy_lignes
    // Toute autre propriete renvoie undefined (par defaut du Proxy
    // quand on ne gere pas le cas).
    return new Proxy({}, {
        get(target, prop) {
            if (prop === "colonnes") return proxy_colonnes;
            if (prop === "lignes")   return proxy_lignes;
            return undefined;
        }
    });
}


/* =====================================================================
   TEST RAPIDE DU PROXY (a executer depuis la console du navigateur)
   ---------------------------------------------------------------------
   Exemple :
     fetch("./data.json")
       .then(r => r.json())
       .then(json => {
          const c = adaptateur_contenu_vproxy(json);
          console.log(c.colonnes.length);     // 9
          console.log(c.colonnes[0]);         // "Autodiscipline"
          console.log(c.lignes.length);       // 7
          console.log(c.lignes[0][0]);        // "Aldwin Starweaver"
          console.log(c.lignes[0][1]);        // 12  (premiere note)
       });
   ===================================================================== */
