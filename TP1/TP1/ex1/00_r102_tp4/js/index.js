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

/// rq that est juste un nom de parametre on peut le changer  
function rajoute_un_clic_alt(that){
    console.log(" premier clic");
    if(that.innerText == "Hello !"){
        alert("Welcome !");
        that.innerText = "re Hello !";
    }
    else{
        alert("on s'est deja vue non ?");
    }

}