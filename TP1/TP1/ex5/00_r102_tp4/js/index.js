//"use strict"; 

// variabelqui stocke la position de chaque div
const pos = {

  // pour le div cadre 1 -> cléé : valeur 
  // sa position actuelle est left=1px et top=1px
  cadre1: { 
    left: 1, 
    top: 1 
    },

  // pour le div id="cadre2"
  cadre2: { 
    left: 1, 
    top: 1
  },

  // pour le div id="cadre3"
  cadre3: { 
    left: 1,
     top: 1 
},

  // pour le div id="filtre1"
  filtre1:{ 
    left: 1, 
    top: 1 
    }

};
/*
    on a donc ici ce schema :
    pos
 ├─ cadre1
 │   ├─ left : 1
 │   └─ top  : 1
 │
 ├─ cadre2
 │   ├─ left : 1
 │   └─ top  : 1
 │
 ├─ cadre3
 │   ├─ left : 1
 │   └─ top  : 1
 │
 └─ filtre1
     ├─ left : 1
     └─ top  : 1

et pour acceder a la valeur de chaque clee : pos['cadre1'] 
*/

document.addEventListener("DOMContentLoaded", (event) => {

    d1 = document.querySelector('div');
    // Q5 : mousemove sur chacun des div cadres/filtre
  ["cadre1", "cadre2", "cadre3", "filtre1"].forEach(id => {
    const d = document.getElementById(id);
    if (d != null){
         d.addEventListener("mousemove", move_img);
    }
  });

});

function move_img(event){
    // on verifie si il ya eu clique gauche 
         console.log(event)

    if(event.buttons ==1){
        console.log(event)
    const dx = event.movementX ;
    const dy = event.movementY;
    const evenement = event.target;
    const id = evenement.id ;

    pos[id].left += dx ;
    pos[id].top += dy ;

    evenement.style.top = pos[id].top + "px";// donc en gros on affecte la nouvelle valeur au css
    evenement.style.left = pos[id].left + "px";
}
    
}



