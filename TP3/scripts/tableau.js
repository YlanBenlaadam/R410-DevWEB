/* =====================================================================
   TP3 - tableau.js
   =====================================================================
   VUE D'ENSEMBLE
   ---------------------------------------------------------------------
   Ce fichier contient 4 fonctions importantes :

     1) get_table_in_desktop_view(id_table)
        -> Va chercher les donnees sur le serveur (fetch),
           puis construit la <table> en version "desktop" classique.

     2) get_table_in_mobile_view(id_table)
        -> Meme chose, mais construit une <table> en version "mobile"
           (2 colonnes : discipline / note).

     3) adaptateur_contenu(json)
        -> Transforme le json "brut" de data.json (avec .disciplines
           et .premiere_annee) en un objet au format attendu par les
           fonctions ci-dessus (avec .colonnes et .lignes).

     4) adaptateur_contenu_vproxy(json)
        -> Meme service que (3), mais en utilisant l'objet Proxy de JS
           pour INTERCEPTER les acces a la volee, SANS dupliquer les
           donnees.

   RAPPEL SUR fetch
   ---------------------------------------------------------------------
   fetch(url) envoie une requete HTTP GET et renvoie une PROMESSE.
   Une promesse est un objet qui represente un resultat qui n'est pas
   encore disponible. Pour reagir quand le resultat arrive, on utilise
   .then().

   EXEMPLE :
       fetch("./data.json")
           .then(reponse => reponse.json())   // converti en objet JS
           .then(obj     => console.log(obj)) // on utilise l'objet
           .catch(err    => console.error(err));

   - Le 1er .then() recoit l'objet Response, dont .json() renvoie
     lui-meme une promesse (d'ou le 2eme .then()).
   - .catch() attrape toute erreur survenue dans la chaine.
   ===================================================================== */


/* ---------------------------------------------------------------------
   CONFIGURATION : ou sont les donnees ?
   ---------------------------------------------------------------------
   On met les URLs dans des constantes en haut du fichier, comme ca
   si elles changent un jour on n'a qu'un seul endroit a modifier.
   --------------------------------------------------------------------- */

// URL du script PHP qui fabrique le JSON au bon format (exo 1)
const URL_NOTES_PHP = "./notes_v1.php";

// URL du fichier JSON brut (format different, necessite l'adaptateur) (exo 2)
const URL_DATA_JSON = "./data.json";

// Si true : on utilise data.json + adaptateur (exo 2)
// Si false : on utilise notes_v1.php directement (exo 1)
const UTILISER_ADAPTATEUR = false;

// Si true : on utilise la version Proxy de l'adaptateur
// Si false : on utilise la version "copie" (simple)
const UTILISER_PROXY = true;



/* =====================================================================
   EXERCICE 1 - FETCH ET CONSTRUCTION DESKTOP
   ===================================================================== */

/* ---------------------------------------------------------------------
   get_table_in_desktop_view(id_table)
   ---------------------------------------------------------------------
   Appelee au clic sur le bouton "Charger les notes (desktop)".

   ETAPES :
     1) Trouver la <table> grace a son id.
     2) Declencher le fetch vers le serveur.
     3) Convertir la reponse en objet JS.
     4) [optionnel] adapter le format si UTILISER_ADAPTATEUR est vrai.
     5) Vider la table (enlever caption et ancien contenu).
     6) Reconstruire <thead> (disciplines) + <tbody> (mages + notes).

   EXEMPLE DE RESULTAT dans le DOM :
       <table id="table_unique">
         <thead>
           <tr>
             <th></th>
             <th>Autodiscipline</th>
             <th>Elementalisme</th>
             ...
           </tr>
         </thead>
         <tbody>
           <tr><th>Shongu</th><td>10</td><td>6</td>...</tr>
           <tr><th>Woshrog</th><td>5</td><td>16</td>...</tr>
         </tbody>
       </table>
   --------------------------------------------------------------------- */
function get_table_in_desktop_view(id_table) {

    // (1) On recupere l'element <table> du DOM grace a son id.
    //     document.getElementById("table_unique") renvoie la balise
    //     <table id="table_unique"> qui est dans le HTML.
    const el_table = document.getElementById(id_table);

    // On choisit l'URL a utiliser selon la config.
    // Operateur ternaire : (condition) ? valeur_si_vrai : valeur_si_faux
    const url = UTILISER_ADAPTATEUR ? URL_DATA_JSON : URL_NOTES_PHP;

    // (2) Declenchement du fetch. fetch() renvoie une Promise.
    fetch(url)

        // (3) Quand la reponse HTTP arrive, on la convertit en JSON.
        //     reponse.json() renvoie ELLE AUSSI une Promise, que le
        //     .then() suivant va attendre pour nous.
        .then(reponse => reponse.json())

        // Quand le JSON est disponible, on entre dans ce .then().
        .then(json => {

            // Trace debug : on affiche dans la console ce qu'on a recu.
            // Tres utile pour verifier le format des donnees.
            console.log("[desktop] donnees recues :", json);

            // (4) Si l'exo 2 est actif, on passe le json dans un adaptateur
            //     pour obtenir un objet avec .colonnes et .lignes.
            //     Sinon, le json est deja au bon format (notes_v1.php).
            let contenu = json;
            if (UTILISER_ADAPTATEUR) {
                contenu = UTILISER_PROXY
                    ? adaptateur_contenu_vproxy(json)
                    : adaptateur_contenu(json);
            }

            // (5) NETTOYAGE de la table :
            //     On supprime tous les enfants un par un, jusqu'a ce
            //     que la table soit completement vide (firstChild null).
            //     Cela supprime entre autres le <caption> de depart.
            while (el_table.firstChild != null) {
                el_table.removeChild(el_table.firstChild);
            }

            // (6) Reconstruction du <thead>.
            const thead = document.createElement("thead");  // cree <thead>
            const trHead = document.createElement("tr");    // cree <tr>

            // Premiere case du thead : vide, car elle surmontera la
            // colonne des noms de mages (qui n'a pas de titre).
            trHead.appendChild(document.createElement("th"));

            // Pour chaque discipline, on ajoute un <th> avec son nom.
            // contenu.colonnes.length = nombre de disciplines (= 9)
            for (let i = 0; i < contenu.colonnes.length; i++) {
                const th = document.createElement("th");          // <th>
                th.innerText = contenu.colonnes[i];               // texte = nom de la discipline
                trHead.appendChild(th);                           // on l'ajoute au <tr>
            }

            // On rattache <tr> dans <thead>, et <thead> dans <table>.
            thead.appendChild(trHead);
            el_table.appendChild(thead);

            // Construction du <tbody>.
            const tbody = document.createElement("tbody");

            // Pour chaque ligne (= pour chaque mage) :
            // contenu.lignes.length = nombre de mages
            for (let i = 0; i < contenu.lignes.length; i++) {

                // Creation d'un nouveau <tr> pour ce mage.
                const tr = document.createElement("tr");

                // ligne = tableau [nom, note0, note1, ..., note8]
                const ligne = contenu.lignes[i];

                // La 1re case d'une ligne = le NOM du mage (dans un <th>)
                const thNom = document.createElement("th");
                thNom.innerText = ligne[0];                      // ex : "Shongu"
                tr.appendChild(thNom);

                // Les cases suivantes = les notes (dans des <td>).
                // On commence a j = 1 car j = 0 est deja pris par le nom.
                for (let j = 1; j < ligne.length; j++) {
                    const td = document.createElement("td");
                    td.innerText = ligne[j];                     // ex : 10
                    tr.appendChild(td);
                }

                // On ajoute la ligne complete au <tbody>.
                tbody.appendChild(tr);
            }

            // Enfin, on rattache <tbody> a <table>.
            el_table.appendChild(tbody);
        })

        // .catch() : si une erreur survient (reseau, JSON invalide, ...)
        // on l'affiche dans la console pour aider au debug.
        .catch(err => {
            console.error("[desktop] erreur fetch :", err);
        });
}



/* =====================================================================
   EXERCICE 1 - FETCH ET CONSTRUCTION MOBILE
   ===================================================================== */

/* ---------------------------------------------------------------------
   get_table_in_mobile_view(id_table)
   ---------------------------------------------------------------------
   Affichage "smartphone" : le tableau a 2 colonnes (Discipline, Note).
   Pour chaque mage, on ajoute :
     - une ligne d'en-tete avec le nom du mage (colspan=2)
     - 9 lignes, une par discipline, avec la note associee.

   EXEMPLE DE RESULTAT :
       Discipline      | Notes
       ----------------+-------
       Shongu                     <-- ligne colspan=2 avec le nom
       Autodiscipline  | 10
       Elementalisme   | 6
       ...
       Woshrog
       Autodiscipline  | 5
       Elementalisme   | 16
       ...
   --------------------------------------------------------------------- */
function get_table_in_mobile_view(id_table) {

    // On recupere la <table>
    const el_table = document.getElementById(id_table);

    // On choisit la source de donnees
    const url = UTILISER_ADAPTATEUR ? URL_DATA_JSON : URL_NOTES_PHP;

    // Fetch : exactement le meme principe que pour le desktop
    fetch(url)
        .then(reponse => reponse.json())
        .then(json => {

            console.log("[mobile] donnees recues :", json);

            // Adaptation eventuelle pour l'exo 2
            let contenu = json;
            if (UTILISER_ADAPTATEUR) {
                contenu = UTILISER_PROXY
                    ? adaptateur_contenu_vproxy(json)
                    : adaptateur_contenu(json);
            }

            // Vidage complet de la table
            while (el_table.firstChild != null) {
                el_table.removeChild(el_table.firstChild);
            }

            // On ajoute une classe "mobile" pour pouvoir styler
            // differemment si on veut (optionnel).
            el_table.classList.add("mobile");

            // --- CONSTRUCTION DU THEAD (les 2 colonnes) ---
            const thead = document.createElement("thead");
            const trHead = document.createElement("tr");

            const th1 = document.createElement("th");
            th1.innerText = "Discipline";

            const th2 = document.createElement("th");
            th2.innerText = "Notes";

            trHead.appendChild(th1);
            trHead.appendChild(th2);
            thead.appendChild(trHead);
            el_table.appendChild(thead);

            // --- CONSTRUCTION DU TBODY ---
            const tbody = document.createElement("tbody");

            // Boucle sur les mages
            for (let i = 0; i < contenu.lignes.length; i++) {

                // ligne = [nom, note0, note1, ..., note8]
                const ligne = contenu.lignes[i];

                // Ligne d'entete avec le nom du mage (colspan=2)
                // pour qu'elle occupe les 2 colonnes visuellement.
                const trNom = document.createElement("tr");
                const thNom = document.createElement("th");
                thNom.setAttribute("colspan", "2");
                thNom.innerText = ligne[0];                    // nom du mage
                trNom.appendChild(thNom);
                tbody.appendChild(trNom);

                // Boucle sur les disciplines : on cree 9 lignes
                // (une par discipline) avec la note correspondante.
                for (let j = 0; j < contenu.colonnes.length; j++) {

                    const tr = document.createElement("tr");

                    // Alternance de couleurs via classes CSS
                    // (ligne1 pour les indices pairs, ligne2 pour impairs)
                    tr.classList.add(j % 2 === 0 ? "ligne1" : "ligne2");

                    // Colonne de gauche : nom de la discipline
                    const th = document.createElement("th");
                    th.innerText = contenu.colonnes[j];

                    // Colonne de droite : la note correspondante.
                    // ATTENTION au decalage : ligne[0] est le NOM du mage,
                    // donc les notes commencent a ligne[1]. La note de
                    // la discipline j se trouve donc a ligne[j + 1].
                    const td = document.createElement("td");
                    td.innerText = ligne[j + 1];

                    tr.appendChild(th);
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                }
            }

            el_table.appendChild(tbody);
        })
        .catch(err => {
            console.error("[mobile] erreur fetch :", err);
        });
}



/* =====================================================================
   EXERCICE 2 - ADAPTATEUR (VERSION COPIE)
   =====================================================================
   PROBLEME A RESOUDRE
   ---------------------------------------------------------------------
   data.json a cette structure :
       {
         disciplines : ["Autodiscipline", ..., "Artisant"],
         premiere_annee : [
            { nom: "Aldwin", phoneNumber, email, notes: [12,7,18,...] },
            ...
         ]
       }

   Mais nos fonctions get_table_in_... attendent :
       {
         colonnes : [...],
         lignes   : [["Aldwin", 12, 7, 18, ...], ...]
       }

   IL FAUT DONC TRANSFORMER l'un en l'autre.

   VERSION 1 : on CREE un nouvel objet et on RECOPIE les donnees.
   ===================================================================== */
function adaptateur_contenu(json) {

    // On cree un objet vide qui va devenir notre resultat.
    const contenu = {};

    // .colonnes = copie du tableau des disciplines.
    // .slice() (sans arguments) renvoie une COPIE d'un tableau.
    // On prefere une copie pour ne pas "partager" la reference
    // avec le json d'origine.
    contenu.colonnes = json.disciplines.slice();

    // .lignes = tableau vide qu'on va remplir
    contenu.lignes = [];

    // On parcourt chaque mage (chaque element de premiere_annee)
    for (let i = 0; i < json.premiere_annee.length; i++) {

        // On recupere le mage courant (un OBJET avec nom, notes, ...)
        const mage = json.premiere_annee[i];

        // On cree une ligne au format [nom, note0, note1, ..., note8].
        // [mage.nom] = un tableau contenant juste le nom.
        // .concat(mage.notes) = y ajoute tous les elements de mage.notes.
        //
        // EXEMPLE :
        //     ["Aldwin"].concat([12, 7, 18])
        //     -> ["Aldwin", 12, 7, 18]
        const ligne = [mage.nom].concat(mage.notes);

        // On ajoute la ligne a la fin du tableau
        contenu.lignes.push(ligne);
    }

    // On renvoie l'objet final pret a l'emploi
    return contenu;
}



/* =====================================================================
   EXERCICE 2 - ADAPTATEUR VERSION PROXY
   =====================================================================
   QU'EST-CE QU'UN PROXY EN JAVASCRIPT ?
   ---------------------------------------------------------------------
   Un Proxy est un objet SPECIAL qui intercepte les acces a un autre
   objet. On le cree avec :

       new Proxy(cible, handler)

   - "cible" : l'objet sous-jacent (souvent {} ici, vide).
   - "handler" : un objet avec des METHODES SPECIALES appelees "traps"
                 qui sont declenchees lors de certains acces.

   TRAP LA PLUS UTILE : get(target, prop)
       Appelee a chaque fois qu'on lit une propriete du proxy.
       Exemple :
           const p = new Proxy({}, {
               get(target, prop) {
                   return "vous avez demande " + prop;
               }
           });
           console.log(p.toto);   // "vous avez demande toto"
           console.log(p[42]);    // "vous avez demande 42"

   IMPORTANT : prop est TOUJOURS une CHAINE, meme pour les indices.
   Pour obtenir un nombre, il faut faire Number(prop).

   POURQUOI PLUSIEURS PROXY IMBRIQUES ?
   ---------------------------------------------------------------------
   On veut simuler :
       contenu.colonnes.length       -> le nb de disciplines
       contenu.colonnes[3]           -> une discipline
       contenu.lignes.length         -> le nb de mages
       contenu.lignes[2]             -> une ligne entiere
       contenu.lignes[2][0]          -> le nom du mage 2
       contenu.lignes[2][5]          -> une note du mage 2

   Comme on ne peut pas lister a l'avance tous les indices possibles,
   on ne peut pas declarer un objet normal. Il faut un Proxy qui
   attrape TOUS les acces.

   Et comme lignes[i] doit lui-meme repondre a .length et a [j],
   il doit etre UN AUTRE PROXY. D'ou : un Proxy qui renvoie un Proxy.
   ===================================================================== */
function adaptateur_contenu_vproxy(json) {

    /* ===================================================================
       PROXY n1 : celui qui simule .colonnes
       -----------------------------------------------------------------
       Il doit repondre a :
         .length  -> nb de disciplines
         [i]      -> la i-eme discipline
       =================================================================== */
    const proxy_colonnes = new Proxy({}, {

        // get est declenchee a chaque lecture de propriete.
        // target = {} (peu importe), prop = la propriete demandee.
        get(target, prop) {

            // Cas 1 : on demande .length
            // (ex: contenu.colonnes.length)
            if (prop === "length") {
                // On renvoie la taille reelle du tableau d'origine.
                return json.disciplines.length;
            }

            // Cas 2 : on demande un indice (0, 1, 2, ...)
            // prop est une chaine ("3"), on la convertit en nombre.
            // On renvoie la discipline a cet indice dans le json.
            return json.disciplines[Number(prop)];
        }
    });


    /* ===================================================================
       FONCTION FABRIQUE : cree un Proxy pour UNE ligne donnee
       -----------------------------------------------------------------
       Une ligne doit repondre a :
         .length  -> nombre de cases (1 pour le nom + 9 pour les notes)
         [0]      -> le nom du mage
         [j>=1]   -> la note (j-1) du mage

       Pour savoir DE QUEL mage on parle, on passe l'indice i en
       parametre. C'est une "closure" : la fonction interne (get)
       garde acces au mage meme apres que la fonction externe ait
       retourne.
       =================================================================== */
    function faire_proxy_ligne(i) {

        // On recupere une fois pour toutes le mage a l'indice i.
        const mage = json.premiere_annee[i];

        // On cree un nouveau Proxy. Il capturera tous les acces
        // (.length, [0], [1], ...).
        return new Proxy({}, {

            get(target, prop) {

                // Cas 1 : demande de .length
                // = 1 (le nom) + nombre de notes
                // Exemple : 1 + 9 = 10
                if (prop === "length") {
                    return 1 + mage.notes.length;
                }

                // On convertit l'indice en nombre
                const idx = Number(prop);

                // Cas 2 : indice 0 -> on renvoie le NOM du mage
                if (idx === 0) {
                    return mage.nom;
                }

                // Cas 3 : indice >= 1 -> on renvoie la note (idx-1)
                // Decalage de 1 car l'indice 0 est occupe par le nom.
                return mage.notes[idx - 1];
            }
        });
    }


    /* ===================================================================
       PROXY n2 : celui qui simule .lignes
       -----------------------------------------------------------------
       Il doit repondre a :
         .length  -> nb de mages
         [i]      -> la ligne i (qui elle-meme est un proxy !)
       =================================================================== */
    const proxy_lignes = new Proxy({}, {

        get(target, prop) {

            // Cas 1 : .length = nombre de mages
            if (prop === "length") {
                return json.premiere_annee.length;
            }

            // Cas 2 : [i] = on fabrique A LA VOLEE un proxy de ligne
            // pour le mage a l'indice i. On ne stocke rien : chaque
            // acces cree un nouveau proxy. Tres leger.
            return faire_proxy_ligne(Number(prop));
        }
    });


    /* ===================================================================
       PROXY RACINE : l'objet renvoye par la fonction.
       -----------------------------------------------------------------
       Il doit repondre a :
         .colonnes  -> le proxy de colonnes
         .lignes    -> le proxy de lignes
       =================================================================== */
    return new Proxy({}, {
        get(target, prop) {
            if (prop === "colonnes") return proxy_colonnes;
            if (prop === "lignes")   return proxy_lignes;
            // Pour toute autre propriete, on ne sait pas quoi renvoyer,
            // donc on renvoie undefined (c'est le comportement par defaut
            // pour une propriete qui n'existe pas).
            return undefined;
        }
    });
}


/* =====================================================================
   COMMENT TESTER LE PROXY DEPUIS LA CONSOLE DU NAVIGATEUR
   ---------------------------------------------------------------------
   Ouvrir la console (F12), puis coller :

       fetch("./data.json")
         .then(r => r.json())
         .then(json => {
             const c = adaptateur_contenu_vproxy(json);
             console.log(c.colonnes.length); // 9
             console.log(c.colonnes[0]);     // "Autodiscipline"
             console.log(c.lignes.length);   // 7
             console.log(c.lignes[0][0]);    // "Aldwin Starweaver"
             console.log(c.lignes[0][1]);    // 12
             console.log(c.lignes[3][5]);    // une note quelconque
         });

   On doit observer exactement le meme comportement que si on avait
   utilise adaptateur_contenu (version copie). C'est le principe du
   DUCK TYPING : "si ca repond comme un canard, c'est un canard".
   ===================================================================== */
