//"use strict"; 

// on stockera ici la premiere image cliquer 
let firstImg = null;

document.addEventListener("DOMContentLoaded", (event) => {

    img1 = document.querySelectorAll('.album img');
    img1.forEach(image => {
    
      image.addEventListener('click',echange_images)
  });

});

function swapNodes(a, b) {
  if (a === b) return; // verifier que ce ne sont pas les memes images 

  const parent = a.parentNode;// Cette propriété permet de trouver l’élément HTML qui contient l’élément.
  const aNext = a.nextSibling;// donne l'element juste apres a dans le dom (la 2nd image)
// a.parentnode = img.parentnode <=> div class  album

  parent.insertBefore(a, b);// place a avant b

  if (aNext === b) { // cas special (les images sont coller )
    parent.insertBefore(b, a.nextSibling);
  } else {
    parent.insertBefore(b, aNext);
  }
}

function echange_images(event){
    
    if(document.getElementById("c1").checked){
       const image = event.target ;

       // aucun 1 er choix 
       if(firstImg == null) {
        firstImg = image ;
        firstImg.classList.add("selected");// on la marque grace au css 
        return ; // on attend le 2eme clique 
       }

       //ici on a deja firstimage
       const secondImg = image ;
       swapNodes(firstImg, secondImg);// on echange donc les 2 images 

       // nettoyage : enlever marquage et reset
      firstImg.classList.remove("selected");
      firstImg = null;
    }
    
    
}



