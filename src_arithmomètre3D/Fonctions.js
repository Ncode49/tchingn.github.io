/*Leibniz = [];
    Curseur= [0,0,0,0,0,0];
	Compteur=  [0,0,0,0,0,0,0];
    RoueAccumulateur = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    Accumulateur = [0,0,0,0,0,0,0,0,0,0,0,0];
    Renverseur = null;
    Retenue = [false,false,false,false,false,false,false,false,false,false,false,false];
    */

    MAT_ACC = new Array();
    MAT_ACC_FIN = [0,0,0,0,0,0,0,0,0,0,0,0];
    MAT_RET = new Array();
    MAT_COMPT = [];
    MAT_COMPT_FIN = [0,0,0,0,0,0,0];
    COMPT_RAZ = new Array();
    
    
    Leibniz = [];
    Curseur= [];
    Compteur=  [9,9,9,9,9,9,9];
    RoueAccumulateur = [];
    Accumulateur = [];
    Renverseur=RenverseurSurSous;
    Retenue = [];
    
    
    function nextStep(dec,cran){
        if(!Renverseur){
        	//Mode ADDITION
		    for (var j=0;j<6;j++){
		    	var indice = j+parseInt(dec);
		        if (Leibniz[j].getDent(0)!=-1){		        	
		            if (Leibniz[j].getDent(0)<=Curseur[j] && Leibniz[j].getDent(0)>0){
		                Accumulateur[indice]=Accumulateur[indice]+1;
		                
		                if(Accumulateur[indice]==10){
		                    Accumulateur[indice]=0;
		                    if(indice<11){
		                        Retenue[indice+1]=true;
		                    }
		                }
		            }
		        }
		        else{
		            retenue(indice);
		        }
		        Leibniz[j].decalage(-1);
		    }
		}
	
		else{
			//Mode SOUSTRACTION
			for (var j=0;j<6;j++){
				var indice = j+parseInt(dec);
		        if (Leibniz[j].getDent(0)!=-1){
		        
	       	    	if (Leibniz[j].getDent(0)<=Curseur[j] && Leibniz[j].getDent(0)>0){
	         	    	Accumulateur[indice]=Accumulateur[indice]-1;
	         	    	
	         	       	if(Accumulateur[indice]==-1){
	         	           	Accumulateur[indice]=9;
	          	          	if(indice<11){
	           	             	Retenue[indice+1]=true;
	          	          	}
	          	      	}
	        	    }
	        	}
		        else{
		            retenue(indice);
		        }
		        Leibniz[j].decalage(-1);
		    }	
		}
		if(cran == 15){
			if(6+parseInt(dec)<12)
				retenue(6+parseInt(dec));
		}
		if(cran == 16){
			if(7+parseInt(dec)<12)
				retenue(7+parseInt(dec));
		}		  
    }
     
    function retenue(i){
    	i = parseInt(i);
        if(Retenue[i]){
        	if(!Renverseur){
		        Accumulateur[i]++;
		        if(Accumulateur[i]==10){
		            Accumulateur[i]=0;
		            if(i<11){
		                Retenue[i+1]=true;
		            }
		        }
		    } else {
		    	Accumulateur[i]=Accumulateur[i]-1;
		        if(Accumulateur[i]==-1){
		            Accumulateur[i]=9;
		            if(i<11){
		                Retenue[i+1]=true;
		            }
		        }
		    
		    }
		    Retenue[i]=false;		     
        }
	}
    
        
    function affichage(acc){
        var n = acc.length;
        var monString ="";
        for(var j=n-1;j>=0;j--){
            monString = monString+(acc[j])+";";
        }
        
        console.log(monString+"\n");
    }

    function affichageCompt(compt,RoueAccumulateur){
        var n = compt.length;
        var monString ="";
        for(var j=n-1;j>=0;j--){
            monString = monString+RoueAccumulateur[compt[j]]+";";
        }
        console.log(monString+"\n");
    }

	function amorcage(){
        for(var i=0;i<6;i++){
            Leibniz[i]=new Cylindre(9);
        }
        for (var i=0;i<6;i++){
            Curseur[i]=positionCurseur[i];
        }
        for(var i=0;i<7;i++){
        	Compteur[i]=positionCompteur[i]+9;
        }
        //0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18
        //9 8 7 6 5 4 3 2 1 0 1  2  3  4  5  6  7  8  9
        for(var i=0;i<9;i++){
        	RoueAccumulateur[i]=i-9;
        	RoueAccumulateur[i+10]=i+1;
        }
        RoueAccumulateur[9]=0;
        for(var i=0;i<12;i++){
            Accumulateur[i]=positionAccu[i];
            Retenue[i]=false;
        }
        
        //initialisation des cylindres
        Leibniz[1].decalage(1);
        Leibniz[2].decalage(2);
        Leibniz[3].decalage(3);
        Leibniz[4].decalage(4);
        Leibniz[5].decalage(5);
        
		for (x = 0; x < 12; x++) {
  			MAT_ACC[x] = [];
  			MAT_RET[x] = [];
  			for (y = 0; y < 20; y++) {
    			MAT_ACC[x][y] = 0;
    			MAT_RET[x][y] = 0;
  			}
		}
    }
    
    
    
    
	
	function Arnaque_modulo(a){
		a=parseInt(a);
		if(a==-1){
			return 17;
		}else{
			if(a==19){
				return 1;
			}else{
				return a;
			}
		}
	}
	
	function process(){
		Renverseur = RenverseurSurSous;
		amorcage();
		
        var monString="";
    
        //uniquement des entiers a 6 chiffres maximum
     	if(!Renverseur){
            var nmb2 = positionDecalage;
            //affichage(positionCurseur);
            for(var i=0;i<20;i++){  
            	var Accumulateur2 = copier();      	
            	var Retenue2=copierB(Retenue);
                nextStep(nmb2,i);
                MAT_ACC[i]=diffInt(Accumulateur,Accumulateur2); 
                MAT_RET[i]=diffBou(Retenue,Retenue2);    
            }
            //Compteur[nmb2]++;
            Compteur[nmb2]=Arnaque_modulo(Compteur[nmb2]+1);
			MAT_COMPT=diffCompt(Compteur,nmb2);								//RecupRotCompt
			
			for(var i=0;i<7;i++){
				MAT_COMPT_FIN[i]=Compteur[i]-9;
				positionCompteur[i]=Compteur[i]-9;
			}
			
	    } else {
        	var nmb2 = positionDecalage;

        	for(var i=0;i<20;i++){   
            	var Accumulateur2 = copier();
            	var Retenue2=copierB(Retenue);
                nextStep(nmb2,i);										               
                MAT_ACC[i]=diffInt(Accumulateur,Accumulateur2);							//RecupRotAcc 
                MAT_RET[i]=diffBou(Retenue,Retenue2);
            }

            //Compteur[nmb2]--;
            Compteur[nmb2]=Arnaque_modulo(Compteur[nmb2]-1);
            MAT_COMPT=diffCompt2(Compteur,nmb2);							//RecupRotCompt
            
            
            for(var i=0;i<7;i++){
				MAT_COMPT_FIN[i]=Compteur[i]-9;
				positionCompteur[i]=Compteur[i]-9;
			}
        }
		MAT_ACC_FIN=copier();
		/*Fonction_RAZ();
		for(var i=0; i<17;i++){
			console.log(i);
			affichage(COMPT_RAZ[i]);
		}*/
		
		/* bricolage pour retarder la remontÃ©e de 3/20 tour */
						for(var i=16;i>=0;i--)
							for (var j=0;j<Retenue.length;j++)
							{
								if (MAT_RET[i][j] == -1 && MAT_RET[i+3][j] == 0)
								{
									MAT_RET[i][j] = 0 ;
									MAT_RET[i+3][j] = -1 ;
								}
							}
		/* fin du bricolage */
	// calcul de valNumAccu et valNumCompteur
	valNumAccu = 0;
	valNumCompteur = 0 ;
	for(var i=0; i<Accumulateur.length; i++){ valNumAccu = 10* valNumAccu + Accumulateur[i] ; } 
	for(var i=0; i<7; i++){ valNumCompteur = 10* valNumCompteur + (Compteur[i]-9) ; } 

	}
	
	function Fonction_RAZ(){
		for(var i=0; i<17;i++){
			COMPT_RAZ[i]=[];
			for(var j=0; j<7; j++){
				if(Compteur[j]!=9){
					COMPT_RAZ[i][j]=1;
					Compteur[j]=Arnaque_modulo(Compteur[j]+1);
				}else{
					COMPT_RAZ[i][j]=0;
				}
			}
			
		}
		for(var i=0; i<17;i++){
			// console.log(i);
			// affichage(COMPT_RAZ[i]);
		}
		for(var i=0;i<7;i++){
			MAT_COMPT_FIN[i]=Compteur[i]-9;
			positionCompteur[i]=Compteur[i]-9;
		}
		// Compteur=  [9,9,9,9,9,9,9];
		// positioncompteur = [0,0,0,0,0,0,0];
		// MAT_COMPT_FIN = [0,0,0,0,0,0,0];
		return COMPT_RAZ;
		
	}
	
	
	
	function copier(){
		var tab2 = [];
		for(var i=0; i<Accumulateur.length; i++){
			tab2[i]=Accumulateur[i];
		}
		return tab2;
	}

	function copierB(tab){
		var tab2 = [];
		for(var i=0; i<tab.length; i++){
			tab2[i]=tab[i];
		}
		return tab2;
				
	}

	function diffInt(tab,tab2){
		var tab3 = [];
		for(var i=0; i<tab.length;i++){
			if((tab[i]-tab2[i])==-9){
				tab3[i]=1;
			}
			else if((tab[i]-tab2[i])==9){
				tab3[i]=-1;
			}
			else{
				tab3[i]=tab[i]-tab2[i];
			}
		}
		return tab3;
	}
	
	function diffBou(tab,tab2){
		var tab3 = [];
		for(var i=tab.length-1; i>=0;i--){
			tab3[i] = 0
			if (!tab2[i] && tab[i]) tab3[i]=1;
			if (tab2[i] && !tab[i]) tab3[i]=-1;
		}
		return tab3;
	}

	function diffCompt(tab,j){
		var tab2=[];
		for(var i=0;i<tab.length;i++){
			tab2[i]=0;
		}
		tab2[j]=1;
		return tab2;
	}
	
	function diffCompt2(tab, j){
		var tab2=[];
		for(var i=0;i<tab.length;i++){
			tab2[i]=0;
		}
		tab2[j]=-1;
		return tab2;
	}