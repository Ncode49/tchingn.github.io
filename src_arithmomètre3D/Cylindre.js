	
//	var dent = [];
var Cylindre ={dent:[]}; // crÃ©ation classe
	
var Cylindre = function (nbreDents){ // constructeur
    var cmpt=1;
    
    
    d = [];
    for (var i=19;i>=0;i--){
        if(i<nbreDents){
            d[i]=cmpt;
            cmpt++;
        }
        else if(i==nbreDents){
            d[i]=-1;
        }
        else{
            d[i]=0;
        }
    }
    this.dent = d;
}



Cylindre.prototype.getDent = function(i){ // mÃ©thode
    return this.dent[i];
}

Cylindre.prototype.toStringT = function(){
    console.log("Longueur:");
    for(var i=0;i<dent.length;i++){
        console.log(this.getDent(i)+";");
    }
    console.log("\n");
    console.log("Degre:");
    for(var i=0;i<dent.length;i++){
        console.log(this.getDegre(i)+";");
    }
}




Cylindre.prototype.decalageDroite=function(){
    var tmp=this.dent[0];
    for(var j=0;j<this.dent.length-1;j++){
        this.dent[j]=this.dent[j+1];         
    }
    this.dent[this.dent.length-1]=tmp;
}

Cylindre.prototype.decalageGauche=function(){
    var tmp=this.dent[this.dent.length-1];
    for(var j=this.dent.length-1;j>0;j--){
        this.dent[j]=this.dent[j-1];         
    }
    this.dent[0]=tmp;
}

Cylindre.prototype.decalage = function(nbre){
    if (nbre>0){
        for(var i=0;i<nbre;i++){
           this.decalageGauche();
        }
    }
    else{
        nbre=-nbre;
        for (var i=0;i<nbre;i++){
            this.decalageDroite();
        }
    }
}

