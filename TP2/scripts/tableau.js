
document.addEventListener("DOMContentLoaded", () => {
    surligneNoteFaible();
    calcMoyenne();
    construireContenu();

        const asc = document.querySelectorAll("table thead .asc");
        asc.forEach(a => {
            a.addEventListener('click',trier) ;
        });
        

        const desc = document.querySelectorAll("table thead .desc");
        desc.forEach(d => {
             d.addEventListener('click',trier) ;
        });
       
});


function surligneNoteFaible(){
    console.log();
    const Notes = document.querySelectorAll("tbody td");
    console.log();

    Notes.forEach(notes => {
        
        if(Number(notes.innerText) < 10){
            notes.classList.add("note-faible");
        }
        
    });
}

// question 2

const nbLigne = 12;

let sAutoDisc = 0;
let sElementaliste = 0;
let sNaturalisme = 0;
let sDivination = 0;
let sPretrise = 0;
let sAlteration = 0;
let sConscience = 0;
let sGuerrier = 0;
let sArtisan = 0;

function calcMoyenne() {
    const lignes = document.querySelectorAll("tbody td");

    // 1) on calcule d'abord toutes les sommes
    lignes.forEach(ligne => {
        if (ligne.cellIndex == 1) {
            sAutoDisc += Number(ligne.innerText);
        }
        if (ligne.cellIndex == 2) {
            sElementaliste += Number(ligne.innerText);
        }
        if (ligne.cellIndex == 3) {
            sNaturalisme += Number(ligne.innerText);
        }
        if (ligne.cellIndex == 4) {
            sDivination += Number(ligne.innerText);
        }
        if (ligne.cellIndex == 5) {
            sPretrise += Number(ligne.innerText);
        }
        if (ligne.cellIndex == 6) {
            sAlteration += Number(ligne.innerText);
        }
        if (ligne.cellIndex == 7) {
            sConscience += Number(ligne.innerText);
        }
        if (ligne.cellIndex == 8) {
            sGuerrier += Number(ligne.innerText);
        }
        if (ligne.cellIndex == 9) {
            sArtisan += Number(ligne.innerText);
        }
    });

    // 2) ensuite on remplit la ligne "Moyennes" du tfoot
    const moy = document.querySelectorAll("tfoot tr:first-child td");

    moy.forEach(moys => {
        if (moys.cellIndex == 1) {
            moys.innerText = (sAutoDisc / nbLigne).toFixed(2);
        }
        if (moys.cellIndex == 2) {
            moys.innerText = (sElementaliste / nbLigne).toFixed(2);
        }
        if (moys.cellIndex == 3) {
            moys.innerText = (sNaturalisme / nbLigne).toFixed(2);
        }
        if (moys.cellIndex == 4) {
            moys.innerText = (sDivination / nbLigne).toFixed(2);
        }
        if (moys.cellIndex == 5) {
            moys.innerText = (sPretrise / nbLigne).toFixed(2);
        }
        if (moys.cellIndex == 6) {
            moys.innerText = (sAlteration / nbLigne).toFixed(2);
        }
        if (moys.cellIndex == 7) {
            moys.innerText = (sConscience / nbLigne).toFixed(2);
        }
        if (moys.cellIndex == 8) {
            moys.innerText = (sGuerrier / nbLigne).toFixed(2);
        }
        if (moys.cellIndex == 9) {
            moys.innerText = (sArtisan / nbLigne).toFixed(2);
        }
    });

    //3) suivant la meme logique on remplis la ligne agregation de tfoot

    const agr = document.querySelectorAll("tfoot tr:nth-child(2) td");

agr.forEach(cell => {

    if(cell.cellIndex == 1){
        // Psionisme = Autodiscipline
        cell.innerText = (sAutoDisc / nbLigne).toFixed(2);
    }

    if(cell.cellIndex == 2){
        // Essence = Elementalisme + Naturalisme
        cell.innerText = ((sElementaliste + sNaturalisme) / (2 * nbLigne)).toFixed(2);
    }

    if(cell.cellIndex == 3){
        // Canalisation = Divination + Prêtrise
        cell.innerText = ((sDivination + sPretrise) / (2 * nbLigne)).toFixed(2);
    }

    if(cell.cellIndex == 4){
        // Mentalisme = Altération + Conscience
        cell.innerText = ((sAlteration + sConscience) / (2 * nbLigne)).toFixed(2);
    }

    if(cell.cellIndex == 5){
        // Hybridation = Guerrier + Artisan
        cell.innerText = ((sGuerrier + sArtisan) / (2 * nbLigne)).toFixed(2);
    }

});
}


/// Exercice 3 (fichier texte pr comprendre les tablea)

//question 1
const contenu = {};
function construireContenu(){
    
    const cellMagique = document.querySelectorAll("thead tr:nth-child(2) th");
    contenu.colonnes = [];

    cellMagique.forEach(disc => {
        contenu.colonnes.push(disc.innerText); //on ajoute chaque th dans le tableau
    });

    contenu.lignes = [];
    const lignesNotes = document.querySelectorAll("tbody tr");

    for (let i = 0; i < lignesNotes.length; i++) {

        const notes = [];
        const mesTd = lignesNotes[i].querySelectorAll("td"); // on recupere chaque td corsspondant au tr du for

        mesTd.forEach(td => {
            notes.push(td.innerText); // on ajoute a notes les td du tr un par un
        });

        contenu.lignes.push(notes);// ici on ajoute directement la liste de td a lignes 
    }
}
/*
    RQ -> un contenue.lignes.push(lignesNotes[i].innerText);
    ne marcherait pas car une grosse string avec tt les notes mais nous on veut que chaque notes soit un string
*/

// question 2 
function table_to_mobile(that){
    const nTable = document.querySelector("table");
    nTable.classList.add("mobile");

    while(nTable.firstChild != null){
        nTable.removeChild(nTable.firstChild);
    }

    // construction du thead
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const th1 = document.createElement("th");
    const th2 = document.createElement("th");

    const txt1 = document.createTextNode("Discipline");
    const txt2 = document.createTextNode("Notes");

    nTable.appendChild(thead);
    thead.appendChild(trHead);
    trHead.appendChild(th1);
    trHead.appendChild(th2);

    th1.appendChild(txt1);
    th2.appendChild(txt2);

    // construction du tbody
    const nTbody = document.createElement("tbody");
    nTable.appendChild(nTbody);

    // boucle sur les lignes
    for(let i = 0; i < contenu.lignes.length; i++){

        // boucle sur les colonnes
        for(let j = 0; j < contenu.colonnes.length; j++){

            const tr = document.createElement("tr");
            if(i % 2 === 0){
                tr.classList.add("ligne1");
            }
            else{
                tr.classList.add("ligne2");
            }
            const th = document.createElement("th");
            const td = document.createElement("td");

            // discipline 
            th.innerText = contenu.colonnes[j];

            // note correspondante 
            td.innerText = contenu.lignes[i][j];

            tr.appendChild(th);
            tr.appendChild(td);

            nTbody.appendChild(tr);
        }
    }
}

function table_to_deskstop(that){
    const tbody = document.querySelector("tbody");
    const nTable = document.querySelector("table");
    contenu.colonnes = [];
    contenu.lignes = [];

    for(let i = 0; i<9; i++){
        const tr = tbody.children[i]; // on recupere les 9 premier tr (car tbody a que des tr comme fils)
        const th = tr.children[0]; // on recupere ici que le 1er fils de chaque tr c'est adire tout les th

        contenu.colonnes.push(th.innerText);
    }
    const lignes = tbody.children ;
    for(let i = 0; i< lignes.length ;i += 9){
        const notes = [];// tableau intermediaire pour stocker la liste de notes 
        for(let j = 0; j<9 ; j++){
            const note = lignes[i + j].children[1]; // on recupere le td de chaque tr, i+ j -> pr faire les tr de 9 en 9
            notes.push(note.innerText);
        }
        contenu.lignes.push(notes);
    }

    while(nTable.firstChild != null){
        nTable.removeChild(nTable.firstChild);
    }

    const nThead =  document.createElement("thead");
    nTable.appendChild(nThead);

    const tr = document.createElement("tr");
    nThead.appendChild(tr);

    const td1 = document.createElement("td");
    td1.innerText = "Autodiscipline";

    const td2 = document.createElement("td");
    td2.innerText = "Elementaliste";

    const td3 = document.createElement("td");
    td3.innerText = "Naturalisme";

    const td4 = document.createElement("td");
    td4.innerText = "Divination";

    const td5 = document.createElement("td");
    td5.innerText = "Prètrise";

    const td6 = document.createElement("td");
    td6.innerText = "Altération";

    const td7 = document.createElement("td");
    td7.innerText = "Conscience";

    const td8 = document.createElement("td");
    td8.innerText = "Guerrier";

    const td9 = document.createElement("td");
    td9.innerText = "Artisant";


    tr.appendChild(td1);
    tr.appendChild(td2);    
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);
    tr.appendChild(td9);

    const nTbody = document.createElement("tbody");
    nTable.appendChild(nTbody);

for (let i = 0; i < contenu.lignes.length; i++) {
    const trLigne = document.createElement("tr");// on construis donc les 11 tr (les 11 lignes )

    for (let j = 0; j < contenu.lignes[i].length; j++) { // on parcours chaque tr
        const td = document.createElement("td");
        td.innerText = contenu.lignes[i][j];// pour chaque tr on parcours tout ces td
        trLigne.appendChild(td);// on ajoute le td de la ligne de contenu.ligne du tr
    }

    nTbody.appendChild(trLigne);
}
}

function trier(event){
    const el_table = document.getElementById("tableau") ;
    const lignes = el_table.querySelectorAll("tbody tr");
    const mesTh = el_table.querySelectorAll("thead tr:nth-child(2) th");
    contenu.lignes = [];
    

    lignes.forEach(ligne => {
        const notes = [];
        for(let i =1; i< ligne.children.length;i++){
            notes.push(ligne.children[i].innerText);
        }       
        contenu.lignes.push(notes);
    });

     const btn = event.target; // ici on a le bouton cliquer 

       
        const tr = btn.parentNode.parentNode.parentNode ; // on recupere le tr du bouton cliquer (donc on a tout les th et td de la ligne)
        const th =  btn.parentNode.parentNode;
        const col = 0 ;
        // comme tr.children = htmlCollection on peut pas le parcouri avec un forEach
         for(let i =1; i< tr.children.length;i++){
            if(tr.children[i] == th){ // si le th occurent et le meme th contenant le bouton cliquer 
                col = i - 1; // -1 car dans contenu.lignes la 1re note est à l'indice 0
            }
         }
            if(btn.classList.contains("asc")){
                contenu.lignes.sort((a,b) =>{
                    /*
                        ici on indique a sort comment comparer les elements, elle se charge avec cette regle du trie
                        elle prend donc la valeur situer a l'indice col de la premiere ligne et celle situer au mem indice de la 2nd
                        et en fonction du resultat de la soustraction elle tiera dans lordre croissant
                        aussi 2 nombre sont sur la meme colonne ssi ils sont au meme indice / endroit sur leur ligne 
                    */
                    return Number(a[col]) - Number(b[col]) ; // voir fiche sort
                }); 
            }   
            else{
                    contenu.lignes.sort((a, b) => {
                        return Number(b[col]) - Number(a[col]);
                    });
                }

    // 5) réécrire le tableau HTML avec le nouveau contenu trié
    for(let i = 0; i < lignes.length; i++){
        for(let j = 0; j < contenu.lignes[i].length; j++){
            lignes[i].children[j + 1].innerText = contenu.lignes[i][j];
            /* 
                on reucpere le td qui est a chaque fois le 2nd element du tr et on remplace sont texte par
                l'element situer qui au meme endroit que le tr (meme ligne ) et a la meme colonne 
            */
        }
    }
}






    
