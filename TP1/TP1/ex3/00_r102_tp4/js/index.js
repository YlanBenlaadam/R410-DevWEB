//"use strict"; 
v1 = document.getElementById("hello").innerText;
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





