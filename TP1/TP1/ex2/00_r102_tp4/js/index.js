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
