//"use strict"; 
//v1 = document.getElementById("hello").innerText;
function rajoute_un_click(){
    

    console.log(" premier clic")
    if(v1 == "Hello !"){
        alert("Welcome !");
        v1 = "re hello !";
         document.getElementById("hello").innerText = v1;
        
    }
    else{
        alert("on s'est deja vue non ?");
    }

}
document.addEventListener("DOMContentLoaded", (event) => {
    t1 = document.querySelector('table');//cherche la premiere balise table dans le html
    t1.addEventListener('click',change_couleur);
    //addEventListener('click',change_couleur) : quand on click sur cette table sa appelle change couleur 


    // Sauvegarde du texte original dans data-text_orig 

    const paragraphes = document.querySelectorAll("main p");
    paragraphes.forEach(p => {
        p.setAttribute("data-text_orig", p.innerText);
    });




});



function change_couleur(event) {

    const cellule = event.target;

    // sécurité : on vérifie que c'est bien un TD
    if (cellule.tagName !== "TD") return;

    const nom = cellule.innerText; // nom de la cellule du tableau

    // récupérer TOUS les paragraphes
    const paragraphes = document.querySelectorAll("aside p"); // permet d'avoir tout les p du aside

    // appliquer la couleur à chaque paragraphe
    paragraphes.forEach(p => {
        p.style.color = nom;// on change la couleur de tout les paragraphe par rapport a la cellule cliquer
    });
}

function ajouter_deux_couleurs(){
    in1 = document.getElementById("c1");
    in2 = document.getElementById("c2");

    c1 = in1.value ;// ici il recois l'id de la couleur 
    c2 = in2.value;

    //noeud de texte pas encore visible 
         texte1 = document.createTextNode(c1);
         texte2 = document.createTextNode(c2);
    // creation des cellules td 
        td1 = document.createElement("td");
        td2 = document.createElement("td");
    //attacher les noeud text nod au td
            td1.appendChild(texte1);
            td2.appendChild(texte2);
    //creer la ligne tr et y mettre les td 
                const tr = document.createElement("tr");
                tr.appendChild(td1);
                tr.appendChild(td2);
    // on ajoute le tr au tbody 
                    const tbody = document.querySelector("table tbody");
                    tbody.appendChild(tr);
    //on change la background color des cellules 
    td1.style.backgroundColor = c1 ;
    td2.style.backgroundColor = c2 ;
    
}




    function cherche_dans_paragraphe_de_main(input) {
    // 1 Récupérer la valeur de l'input
    const recherche = input.value.trim().toLowerCase(); // on normalise en minuscules et recherche correspond a ce qu'on tape 
    console.log("Recherche :", recherche);
    trouve  = false ;

    // 2️ Sélectionner tous les paragraphes dans l'aside
    const paragraphes = document.querySelectorAll("main p");

    // 3️ Parcourir chaque paragraphe et vérifier si le texte contient la recherche

    paragraphes.forEach(p => {
        const texte = p.innerText.toLowerCase(); // on normalise le texte du paragraphe
        if (texte.includes(recherche) && recherche !== "") { // si on trouve le paragraphe et qu'on a taper quelque chose
            p.classList.add("highlight"); // ajouter la classe CSS si trouvé, (donc quand on compile des qu'il trouve le paragraphe il lui ajt une class dont on a definit le css deja )
            trouve = true ;
        } else {
            p.classList.remove("highlight"); // retirer sinon
        }
    });
   

    if(trouve == false && recherche != "" ){
        input.setCustomValidity("Aucun paragraphe trouver");
        input.reportValidity();
    }
    else {
        input.setCustomValidity("");// tout va bien
    }
}

function cherche_dans_paragraphes_de_main_v2(input) {
  const recherche = input.value.trim();
  let trouve = false;

  const paragraphes = document.querySelectorAll("main p");

  paragraphes.forEach(p => {
    const texteOriginal = p.getAttribute("data-text_orig");// reprend le p du texte original charger dns le dom                 


    p.innerText = texteOriginal ; // la on a le texte propre 

    if (recherche !== "" && texteOriginal.includes(recherche)) {
      trouve = true;

      const nouveauTexte = texteOriginal.replace(
        recherche, // si on trouve une occurence du mot rechercher dans le p
        "<span class='highlight'>" + recherche + "</span>"//on le remplace par cett commande html qui :
        // va surligner le mot rechercher grace au css
      );
      //important car permet au navigateur de traiter le nouveau texte
      // de creer donc la balise span
      // et donc de surligner le mot rechercher
      p.innerHTML = nouveauTexte;
    } else {
      p.innerText = texteOriginal;
    }
  });

  if (!trouve && recherche !== "") {
    input.setCustomValidity("Aucun paragraphe trouvé");
    input.reportValidity();
  } else {
    input.setCustomValidity("");
  }
}

/*

    SPAN = balise neutre donc ne fait rien de base 
    on l'utilise ici pour entourer le mot rechercher et pouvoir lui appliquer le css 

RQ -> grace au data texte origine sa nous permet que pour chaque p on repart sur la version
de bas du texte celle ou ya aucune modification faite pour surligner ...
*/