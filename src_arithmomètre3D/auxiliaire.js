// Ici commence la partie ajoutÃ©e par A. Guyot

var BruitTour =     new Audio('sons/son-tour.wav');
var BruitDecalage = new Audio('sons/son-decalage.wav');
var BruitInverseur = new Audio('sons/son-inverseur.wav');
var BruitReinitTot = new Audio('sons/son-reinitTot.wav');
var BruitReinitCnt = new Audio('sons/son-reinitCont.wav');
var Bruit1clicks =  new Audio('sons/son-1clicks.wav');
var Bruit2clicks =  new Audio('sons/son-2clicks.wav');
var Bruit3clicks =  new Audio('sons/son-3clicks.wav');
var Bruit4clicks =  new Audio('sons/son-4clicks.wav');
var Bruit5clicks =  new Audio('sons/son-5clicks.wav');
var Bruit7clicks =  new Audio('sons/son-7clicks.wav');
var Bruit9clicks =  new Audio('sons/son-9clicks.wav');
var BruitClick2 =   new Audio('sons/son-click2.wav');
BruitTour.preload = BruitDecalage.preload = BruitInverseur.preload = BruitReinitTot.preload = "auto";
BruitReinitCnt.preload = Bruit1clicks.preload = Bruit2clicks.preload = Bruit3clicks.preload = "auto";
Bruit4clicks.preload = Bruit5clicks.preload = Bruit7clicks.preload = Bruit9clicks.preload = "auto";
var oldValCur = 9 ;
var boiteEnleve = false ;
var chariotOuvert = false ;


function playNcliks (nombClicks){	
	switch (nombClicks) {
		case 0: break ;
		case 1: Bruit1clicks.play() ; break ;
		case 2: Bruit2clicks.play() ; break ;
		case 3: Bruit3clicks.play() ; break ;
		case 4: Bruit4clicks.play() ; break ;
		case 5: Bruit5clicks.play() ; break ;
		case 6:
		case 7: Bruit7clicks.play() ; break ;
		default: Bruit9clicks.play() ; break ;
	}
}

function toggleLangue(){
// FranÃ§ais : language = 0 ; Anglais : language = 1
language = (language == 0) ? 1 : 0  ; 
document.getElementById('Baniere').innerHTML = (language == 0) ? '200<sup>Ã¨me</sup> anniversaire de l\'invention de l\'arithmomÃ¨tre' : '200<sup>th</sup> anniversary of the invention of the arithmometre' ;
document.getElementById('decalage').innerHTML = (language == 0) ? 'DÃ©caler le chariot' : 'Shift the carriage' ;
document.getElementById('remiseZero').innerHTML = (language == 0) ? 'Effacer le totalisateur' : 'Clear the accumulator' ;
document.getElementById('remiseZeroCompteur').innerHTML = (language == 0) ? 'Effacer les compteurs' : 'Clear the counters' ;
document.getElementById('razCurseur').innerHTML = (language == 0) ? 'Effacer les curseurs' : 'Clear the sliders' ;
document.getElementById('textCalculette').innerHTML = (language == 0) ? 'Calculer une expression' : 'Calculate an expression' ;
document.getElementById('Calculette').innerHTML = (language == 0) ? 'Calculette' : 'Calculator' ;
document.getElementById('Extraction').innerHTML = (language == 0) ? 'Racine carrÃ©e' : 'Square root' ;
document.getElementById('Onthefly').innerHTML = (language == 0) ? '&#192; la volÃ©e' : 'On the fly' ;
document.getElementById('vue').innerHTML = (language == 0) ? 'Vues :' : 'View :' ;

if(boiteEnleve) {document.getElementById('enlvBoite').innerHTML = (language == 0) ? 'Remettre le boÃ®tier' : 'Put back the case'}
else {document.getElementById('enlvBoite').innerHTML = (language == 0) ? 'Enlever le boÃ®tier' : 'Remove the case'};

if(chariotOuvert) {document.getElementById('enlvChariot').innerHTML = (language == 0) ? 'Fermer le chariot' : 'Close the carriage'}
else {document.getElementById('enlvChariot').innerHTML = (language == 0) ? 'Ouvrir le chariot' : 'Open the carriage'} ;

document.getElementById('curseur').innerHTML = (language == 0) ? 
'Position curseurs :<br><span id="curseurNum">&nbsp;0 0 0 0 0 0&nbsp;</span>' : ' Sliders position :<br><span id="curseurNum">&nbsp;0 0 0 0 0 0&nbsp;</span>' ;

document.getElementById('help').innerHTML = (language == 0) ? '&nbsp;Aide&nbsp;' : '&nbsp;Help&nbsp;' ;

document.getElementById('FaceIcon').src = (language == 0) ? "images/cubeFace.png" : "images/squareFace.png" ;
document.getElementById('DessusIcon').src = (language == 0) ? "images/cubeDessus.png" : "images/squareDessus.png" ;
document.getElementById('DroiteIcon').src = (language == 0) ? "images/cubeDroite.png" : "images/squareDroite.png" ;
document.getElementById('GaucheIcon').src = (language == 0) ? "images/cubeGauche.png" : "images/squareGauche.png" ;
document.getElementById('DessousIcon').src = (language == 0) ? "images/cubeDessous.png" : "images/squareDessous.png" ;


if (language == 0){
	document.getElementById('choixDess').innerHTML = 'Dessus<input type="radio" name="ChooseTop" checked onclick="choixMaterial(1)"/>bois'
	+ '<input type="radio" name="ChooseTop" onclick="choixMaterial(2)"/>laiton<input type="radio" name="ChooseTop" onclick="choixMaterial(3)"/>argent' ;
	document.getElementById('vitesse').innerHTML = 'Vitesse&nbsp;<input type="radio" id="normale" name="velocite" checked/>normale<input type="radio" id="lente" name="velocite"/>lente' ;
	document.getElementById('Tourner').innerHTML = '<p>&nbsp;Cliquer pour tourner<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;la manivelle</p>' 
	document.getElementById('executer').innerHTML = '&nbsp;Exemples<br><font size="2">exÃ©cuter en boucle</font>'
	} else {
	document.getElementById('choixDess').innerHTML = 'Top<input type="radio" name="ChooseTop" checked onclick="choixMaterial(1)"/>wood'
	+ '<input type="radio" name="ChooseTop" onclick="choixMaterial(2)"/>brass<input type="radio" name="ChooseTop" onclick="choixMaterial(3)"/>silver' ;
	document.getElementById('vitesse').innerHTML = 'Speed&nbsp;<input type="radio" id="normale" name="velocite" checked/>normal<input type="radio" id="lente" name="velocite"/>slow' ;
	document.getElementById('Tourner').innerHTML = '<p>&nbsp;&nbsp;&nbsp;Click to turn the crank</p>' 
	document.getElementById('executer').innerHTML = '&nbsp;Examples<br><font size="2">run in a loop</font>'
	}
}	


function enleverBoite(){
	focusCalculette() ;
	if(boiteEnleve){
		document.getElementById('enlvBoite').innerHTML = (language == 0) ? 'Enlever le boÃ®tier' : 'Remove the case';
		assembleBoite(1) ;
		boiteEnleve = false ;
	}else{
		document.getElementById('enlvBoite').innerHTML = (language == 0) ? 'Remettre le boÃ®tier' : 'Put back the case';
		demonteBoite(1) ;
		boiteEnleve = true ;
	}
}

function assembleBoite(etape){
	switch(etape){
		case 1:
			document.getElementById('enlvBoite').disabled = true;
			scene.add(boiteDessous);
			break;
		case 2:
			scene.add(boiteGauche);
			scene.add(boiteDroite);
			scene.add(boiteCentre);	
			break;
		case 3:
			scene.add(boiteArriere);
			scene.add(boiteAvant);
			break;			
		case 4:
			scene.add(boiteDessus);
			break;
		case 5:
			scene.add(boiteChariot);
			groupChariot.add(boiteChariot);
			break ;
		case 6 :
			document.getElementById('enlvBoite').disabled = false;
			break
	}
	if (etape <= 6) setTimeout(function(){ assembleBoite(etape+1);}, 500);	
}

function demonteBoite(etape){
	switch(etape){
		case 1:
			document.getElementById('enlvBoite').disabled = true;
			scene.remove(boiteChariot);
			groupChariot.remove(boiteChariot);
			break;
		case 2:
			scene.remove(boiteDessus);
			break;
		case 3:
			scene.remove(boiteArriere);
			scene.remove(boiteAvant);
			break;
		case 4:
			scene.remove(boiteGauche);
			scene.remove(boiteDroite);
			scene.remove(boiteCentre);	
			break;
		case 5:
			scene.remove(boiteDessous);
			break;
		case 6:
			document.getElementById('enlvBoite').disabled = false;
			break
	}
	if (etape <= 6) setTimeout(function(){ demonteBoite(etape+1);}, 500);	
}

var debutDegag, finDegag ;
function degagerChariot(){
	document.getElementById('enlvChariot').disabled = true;
	if(document.getElementById('normale').checked) BruitInverseur.play() ;
	focusCalculette() ;
	if(chariotOuvert)
	{
		document.getElementById('enlvChariot').innerHTML = (language == 0) ? 'Ouvrir le chariot' : 'Open the carriage';
		debutDegag = 10; finDegag = 0; degagProg () ;		
		cubeMesh[8].position.x += 1.2 ;
		cubeMesh[9].position.x += 1.2 ;
		cubeMesh[8].position.y -= 0.9 ;
		cubeMesh[9].position.y -= 0.7 ;
		chariotOuvert = false ;
	} else{
		document.getElementById('enlvChariot').innerHTML = (language == 0) ? 'Fermer le chariot' : 'Close the carriage';
		debutDegag = 0; finDegag = 10; degagProg () ;
		cubeMesh[8].position.x -= 1.2 ;
		cubeMesh[9].position.x -= 1.2 ;
		cubeMesh[8].position.y += 0.9 ;
		cubeMesh[9].position.y += 0.7 ;	
		chariotOuvert = true ;
	}
}
		
function degagProg (){
	animdegagProg = requestAnimationFrame(degagProg);
	if (debutDegag < finDegag){
		pivotChariot.rotation.z += 0.1*Math.PI/2 ;
		debutDegag ++ ; 
	} 
	if (debutDegag > finDegag){
		pivotChariot.rotation.z -= 0.1*Math.PI/2 ;
		finDegag ++ ; 
	}
	if (debutDegag == finDegag){
		document.getElementById('enlvChariot').disabled = false;
		window.cancelAnimationFrame(animdegagProg);
	}
}

function PoseIm (ValCurs) { 
	animPoseIm = requestAnimationFrame(PoseIm);
	enCours = true;
	playNcliks(1) ;
	for(var i = 0; i<curseur.length; i++){
		positionCurseur[i] = ValCurs % 10 ;
		curseur[i].position.x = 1.484 - pitchCurseur*(ValCurs % 10) ;
		engrCompt[i].position.x = curseur[i].position.x + 0.1;
		cubeMesh[i].position.x = curseur[i].position.x + + 0.4;
		ValCurs = Math.floor(ValCurs/10);
	}
	SpitCurseurNum () ;
	enCours = false;
	window.cancelAnimationFrame(animPoseIm);
}

function PoseProg (ValCurs){
	var nombClicks = 0 ;
	for(var i = 0; i<curseur.length; i++){
		TargetPos[i] = 1.484 - pitchCurseur*(ValCurs % 10) ;
		nombClicks = Math.max ( Math.abs ((ValCurs % 10)- positionCurseur [i] ) , nombClicks ) ;
		ValCurs = Math.floor(ValCurs/10);
	}
	if(document.getElementById('normale').checked) {playNcliks(nombClicks) ;}
	AnimPoseProg () ;
}

function AnimPoseProg (){
	animPose = requestAnimationFrame(AnimPoseProg);
	enCours = true; TargetReach = true ;
	for(var i = 0; i<curseur.length; i++){
		if (Math.abs(curseur[i].position.x - TargetPos[i]) > 0.05)
		{
			TargetReach = false ;
			if (curseur[i].position.x < TargetPos[i]){
				curseur[i].position.x += 0.5 * tps * velocity ;
			} else {
				curseur[i].position.x -= 0.5 * tps * velocity ;
			}
			engrCompt[i].position.x = curseur[i].position.x + 0.1;
			cubeMesh[i].position.x = curseur[i].position.x + offsetCurseur;
			positionCurseur[i] = Math.floor ((1.492 -curseur[i].position.x)/pitchCurseur ) ;
			SpitCurseurNum () ;
		}
	}		
	if (TargetReach) {
		for(var i = 0; i<curseur.length; i++){
			curseur[i].position.x = TargetPos[i] ;
			engrCompt[i].position.x = curseur[i].position.x + 0.1;
			cubeMesh[i].position.x = curseur[i].position.x + offsetCurseur;
			positionCurseur[i] = Math.floor ((1.492 -curseur[i].position.x)/pitchCurseur ) ;
		}
		SpitCurseurNum () ;
		enCours = false;
		window.cancelAnimationFrame(animPose);
	}
}

function bigImg(x) {
	if (x == null) return;
    x.style.height = "110%";
    x.style.width = "110%";
	setTimeout(function(){bigImg2(x);}, 100);
}
function bigImg2(x) {
    x.style.height = "120%";
    x.style.width = "120%";
}

function smallImg(x) {
	if (x == null) return;
    x.style.height = "110%";
    x.style.width = "110%";
	setTimeout(function(){smallImg2(x);}, 100);
}
function smallImg2(x) {
    x.style.height = "100%";
    x.style.width = "100%";
}
 
function exempleAddition(pas){
	var textExemples = document.getElementById('textExemples') ;
	if (enCours) 
	{ setTimeout(function(){ exempleAddition(pas);}, 500); } // attente active 1/2 seconde
	 else { switch (pas) {
		case 1 : enCoursEx = true; toutBloquer(true); VuExemple (false) ;
				 document.getElementById('titreExemples').innerHTML = 'Addition : 165 + 328';
				 setTimeout(function(){ exempleAddition(pas+1);}, 2000) ; break
		case 2 : textExemples.innerHTML = (language == 0) ? '1 : Effacer le totalisateur' : '1 : Clear the accumulator' ;
				appelRAZaccu();     setTimeout(function(){ exempleAddition(pas+1);}, 3000); break ;	
		case 3 : if (positionDecalage > 0) {verifDecMoins(Math.min(3,positionDecalage)); setTimeout(function(){ exempleAddition(pas);}, 2000)}
				else {exempleAddition(pas+1)} ; break ;
		case 4 : if(RenverseurSurSous){ initRenverseur(); setTimeout(function(){ exempleAddition(pas+1);}, 2000)} 
				else {exempleAddition(pas+1)} ; break ;
		case 5 : textExemples.innerHTML = (language == 0) ? '2 : Poser 1 (centaine)' : '2 : Enter 1 (hundreds)';
				PoseProg(100 + 10*positionCurseur[1] + positionCurseur[0]);    setTimeout(function(){ exempleAddition(pas+1);}, 1500); break ;
		case 6 : textExemples.innerHTML = (language == 0) ? '3 : Poser 6 (dizaine)' : '3 : Enter 6 (tens)';
				PoseProg(160 + positionCurseur[0]);    setTimeout(function(){ exempleAddition(pas+1);}, 1500); break ;
		case 7 : textExemples.innerHTML = (language == 0) ? '4 : Poser 5 (unitÃ©)' : '4 : Enter 5 (units)';
				PoseProg(165);    setTimeout(function(){ exempleAddition(pas+1);}, 1500); break ;			
		case 8 : textExemples.innerHTML = (language == 0) ? '5 : Tourner (0 + 165)' : '5 : Turn (0 + 165)';
				initialise();     setTimeout(function(){ exempleAddition(pas+1);}, 5000); break ;	
		case 9 : textExemples.innerHTML = (language == 0) ? '6 : Poser 3 (centaine)' : '6 : Enter 3 (hundreds)';
				PoseProg(365);    setTimeout(function(){ exempleAddition(pas+1);}, 1500); break ;	
		case 10 : textExemples.innerHTML = (language == 0) ? '7 : Poser 2 (dizaine)' : '7 : Enter 2 (tens)';
				PoseProg(325);    setTimeout(function(){ exempleAddition(pas+1);}, 1500); break ;	
		case 11 : textExemples.innerHTML = (language == 0) ? '8 : Poser 8 (unitÃ©)' : '8 : Enter 8 (unit)';
				PoseProg(328);    setTimeout(function(){ exempleAddition(pas+1);}, 1500); break ;	
		case 12 : textExemples.innerHTML = (language == 0) ? '9 : Tourner (165 + 328)' : '9 : Turn (165 + 328)';
				initialise();     setTimeout(function(){ exempleAddition(pas+1);}, 1500); break ;	
		case 13 : textExemples.innerHTML = (language == 0) ? 'Somme : 165 + 328 = 493' : 'Sum : 165  + 328 = 493';
				setTimeout(function(){ exempleAddition(pas+1);}, 9000); break ;
		case 14 : textExemples.innerHTML = ''; document.getElementById('titreExemples').innerHTML = '';
				enCoursEx = false; toutBloquer(false); VuExemple(true);
				if (document.getElementById('boucle').checked) exempleSoustraction(1) ; break ;
	 }}
}


function exempleSoustraction(pas){
	var textExemples = document.getElementById('textExemples') ;
	if (enCours) 
	{ setTimeout(function(){ exempleSoustraction(pas);}, 500); } // attente active 1/2 seconde
	 else { switch (pas) {
		case 1 : enCoursEx = true; toutBloquer(true); VuExemple (false) ;
				 document.getElementById('titreExemples').innerHTML = (language == 0) ? 'Soustraction : 324 &#150; 152' : 'Subtraction : 324 &#150; 152';
				 setTimeout(function(){exempleSoustraction(pas+1);}, 2000) ; break
		case 2 : textExemples.innerHTML = (language == 0) ? '1 : Effacer le totalisateur' : '1 : Clear the accumulator' ;
				appelRAZaccu();     setTimeout(function(){ exempleSoustraction(pas+1);}, 3000); break ;	
		case 3 : if (positionDecalage > 0) {verifDecMoins(Math.min(3,positionDecalage)); setTimeout(function(){ exempleSoustraction(pas);}, 2000)}
				else {exempleSoustraction(pas+1)} ; break ;
		case 4 : if(RenverseurSurSous){ initRenverseur(); setTimeout(function(){ exempleSoustraction(6);}, 1000)} 
				else {exempleSoustraction(pas+1)} ; break ;
		case 5 : textExemples.innerHTML = (language == 0) ? '2 : Poser 3 (centaine)' : '2 : Enter 3 (hundreds)';
				PoseProg(300 + 10*positionCurseur[1] + positionCurseur[0]);    setTimeout(function(){ exempleSoustraction(pas+1);}, 1500); break ;	
		case 6 : textExemples.innerHTML = (language == 0) ? '3 : Poser 2 (dizaine)' : '3 : Enter 2 (tens)';
				PoseProg(320 + positionCurseur[0]);    setTimeout(function(){ exempleSoustraction(pas+1);}, 1500); break ;	
		case 7 : textExemples.innerHTML = (language == 0) ? '4 : Poser 4 (unitÃ©)' : '4 : Enter 4 (ones)';
				PoseProg(324);    setTimeout(function(){ exempleSoustraction(pas+1);}, 1500); break ;					
		case 8 : textExemples.innerHTML = (language == 0) ? '5 : Tourner (0 + 324)' : '5 : Turn (0 + 324)';
				initialise();     setTimeout(function(){ exempleSoustraction(pas+1);}, 5000); break ;	
		case 9 : textExemples.innerHTML = (language == 0) ? '6 : Engrener Sous - Div' : '6 : Engage Sous -Div';
				initRenverseur(); setTimeout(function(){ exempleSoustraction(pas+1);}, 2000); break ;	
		case 10 : textExemples.innerHTML = (language == 0) ? '7 : Poser 1 (centaine)' : '7 : Enter 1 (hundreds)';
				PoseProg(100 + 10*positionCurseur[1] + positionCurseur[0]);    setTimeout(function(){ exempleSoustraction(pas+1);}, 1500); break ;	
		case 11 : textExemples.innerHTML = (language == 0) ? '8 : Poser 5 (dizaine)' : '8 : Enter 5 (tens)';
				PoseProg(150 + positionCurseur[0]);    setTimeout(function(){ exempleSoustraction(pas+1);}, 1500); break ;	
		case 12 : textExemples.innerHTML = (language == 0) ? '9 : Poser 2 (unitÃ©)' : '9 : Enter 2 (ones)';
				PoseProg(152);    setTimeout(function(){ exempleSoustraction(pas+1);}, 1500); break ;	
		case 13: textExemples.innerHTML = (language == 0) ? '10 : Tourner (324 &#150; 152)' : '10 : Turn (324 &#150; 152)';
				 initialise();    setTimeout(function(){ exempleSoustraction(pas+1);}, 5000); break ;	
		case 14: textExemples.innerHTML = (language == 0) ? 'DiffÃ©rence : 324 &#150; 152 = 172' : 'Difference : 324 &#150; 152 = 172';
				initRenverseur();setTimeout(function(){ exempleSoustraction(pas+1);}, 10000); break ;	
		case 15: textExemples.innerHTML = ''; document.getElementById('titreExemples').innerHTML = '';
				enCoursEx = false; toutBloquer(false); VuExemple(true);
				if (document.getElementById('boucle').checked) exempleMultiplication(1) ; break ;
	 }}
}

function exempleMultiplication(pas){
	var textExemples = document.getElementById('textExemples') ;
	if (enCours) 
	{ setTimeout(function(){ exempleMultiplication(pas);}, 500); } // attente active 1/2 seconde
	 else { switch (pas) {
		case 1 : enCoursEx = true; toutBloquer(true); VuExemple (false) ;
				 document.getElementById('titreExemples').innerHTML = 'Multiplication : 256 &#215; 18';
				 setTimeout(function(){exempleMultiplication(pas+1);}, 2000) ; break
		case 2 : textExemples.innerHTML = (language == 0) ? '1 : Effacer le totalisateur' : '1 : Clear the accumulator' ;
				appelRAZaccu();     setTimeout(function(){ exempleMultiplication(pas+1);}, 3000); break ;	
		case 3 : if (positionDecalage > 0) {verifDecMoins(Math.min(3,positionDecalage)); setTimeout(function(){ exempleMultiplication(pas);}, 2000)}
				else {exempleMultiplication(pas+1)} ; break ;
		case 4 : if(RenverseurSurSous){ initRenverseur(); setTimeout(function(){ exempleMultiplication(pas+1);}, 2000)} 
				else {exempleMultiplication(pas+1)} ; break ;
		case 5 : textExemples.innerHTML = (language == 0) ? '2 : Poser 2 (centaine)' : '2 : Enter 2 (hundreds)';
				PoseProg(200 + 10*positionCurseur[1] + positionCurseur[0]);    setTimeout(function(){ exempleMultiplication(pas+1);}, 1500); break ;	
		case 6 : textExemples.innerHTML = (language == 0) ? '3 : Poser  5 (dizaine)' : '3 : Enter  5 (tens)';
				PoseProg(250 + positionCurseur[0]);    setTimeout(function(){ exempleMultiplication(pas+1);}, 1500); break ;	
		case 7 : textExemples.innerHTML = (language == 0) ? '4 : Poser  6 (unitÃ©)' : '4 : Enter  6 (ones)';
				PoseProg(256);    setTimeout(function(){ exempleMultiplication(pas+1);}, 1500); break ;					
		case 8 : textExemples.innerHTML = (language == 0) ? '5 : Effacer les compteurs' : '5 : Clear the counters';
				appelRAZcompteur(); setTimeout(function(){ exempleMultiplication(pas+1);}, 5000); break ;	
		case 9 : textExemples.innerHTML = (language == 0) ? '6 : Tourner (0 + 256)' : '6 : Turn (0 + 256)';
				initialise();     setTimeout(function(){ exempleMultiplication(pas+1);}, 3000); break ;	
		case 10 : textExemples.innerHTML = (language == 0) ? '7 : Tourner (256 + 256)' : '7 : Turn (256 + 256)';
				initialise();     setTimeout(function(){ exempleMultiplication(pas+1);}, 3000); break ;	
		case 11 : textExemples.innerHTML = (language == 0) ? '8 : Tourner (2&#215;256 + 256)' : '8 : Turn (2&#215;256 + 256)';
				initialise();     setTimeout(function(){ exempleMultiplication(pas+1);}, 3000); break ;	
		case 12 : textExemples.innerHTML = (language == 0) ? '9 : Tourner (3&#215;256 + 256)' : '9 : Turn (3&#215;256 + 256)';
				initialise();    setTimeout(function(){ exempleMultiplication(pas+1);}, 3000); break ;	
		case 13 : textExemples.innerHTML = (language == 0) ? '10 : Tourner (4&#215;256 + 256)' : '10 : Turn (4&#215;256 + 256)';
				initialise();    setTimeout(function(){ exempleMultiplication(pas+1);}, 3000); break ;	
		case 14 : textExemples.innerHTML = (language == 0) ? '11 : Tourner (5&#215;256 + 256)' : '11 : Turn (5&#215;256 + 256)';
				initialise();    setTimeout(function(){ exempleMultiplication(pas+1);}, 3000); break ;	
		case 15 : textExemples.innerHTML = (language == 0) ? '12 : Tourner (6&#215;256 + 256)' : '12 : Turn (6&#215;256 + 256)';
				initialise();    setTimeout(function(){ exempleMultiplication(pas+1);}, 3000); break ;	
		case 16 : textExemples.innerHTML = (language == 0) ? '13 : Tourner (7&#215;256 + 256)' : '13 : Turn (7&#215;256 + 256)';
				initialise();    setTimeout(function(){ exempleMultiplication(pas+1);}, 3000); break ;	
		case 17 : textExemples.innerHTML = (language == 0) ?  '14 : DÃ©caler (multiplier 256 par 10)' : '14 : Shift (multiply 256 by 10)';
				verifDecPlus(1);  setTimeout(function(){ exempleMultiplication(pas+1);}, 2000); break ;	
		case 18 : textExemples.innerHTML = (language == 0) ? '15 : Tourner (256&#215;8 + 256&#215;10)' : '15 : Turn (256&#215;8 + 256&#215;10)';
				initialise();    setTimeout(function(){ exempleMultiplication(pas+1);}, 3000); break ;	
		case 19 : textExemples.innerHTML = (language == 0) ? 'Produit: 256 &#215; 18 = 4608' : 'Product : 256 &#215; 18 = 4608';
				verifDecMoins(1); setTimeout(function(){ exempleMultiplication(pas+1);},10000); break ;	
		case 20: textExemples.innerHTML = ''; document.getElementById('titreExemples').innerHTML = '';
				enCoursEx = false; toutBloquer(false); VuExemple(true);
				if (document.getElementById('boucle').checked) exempleDivision(1) ; break ;
	 }}
}

function exempleDivision(pas){
	var textExemples = document.getElementById('textExemples') ;
	if (enCours) 
	{ setTimeout(function(){ exempleDivision(pas);}, 500); } // attente active 1/2 seconde
	 else { switch (pas) {
		case 1 : enCoursEx = true; toutBloquer(true); VuExemple (false) ;
				 document.getElementById('titreExemples').innerHTML = 'Division : 2 569 &#247; 12';
				 setTimeout(function(){exempleDivision(pas+1);}, 2000) ; break
		case 2 : textExemples.innerHTML = (language == 0) ? '1 : Effacer le totalisateur' : '1 : Clear the accumulator' ;
				appelRAZaccu();     setTimeout(function(){ exempleDivision(pas+1);}, 3000); break ;	
		case 3 : if (positionDecalage > 0) {verifDecMoins(Math.min(3,positionDecalage)); setTimeout(function(){ exempleDivision(pas);}, 1000)}
				else {exempleDivision(pas+1)} ; break ;
		case 4 : if(RenverseurSurSous){ initRenverseur(); setTimeout(function(){ exempleDivision(pas+1);}, 5000)} 
				else {exempleDivision(pas+1)} ; break ;
		case 5 : textExemples.innerHTML = (language == 0) ? '2 : Poser 2 (millier)' : '2 : Enter 2 (thousands)';
				PoseProg(2000 + 100*positionCurseur[2]+ 10*positionCurseur[1] + positionCurseur[0]);    setTimeout(function(){ exempleDivision(pas+1);}, 1000); break ;	
		case 6 : textExemples.innerHTML = (language == 0) ? '3 : Poser 5 (centaine)' : '3 :  Enter 5 (hundreds)';
				PoseProg(2500 + 10*positionCurseur[1] + positionCurseur[0]);    setTimeout(function(){ exempleDivision(pas+1);}, 1000); break ;	
		case 7 : textExemples.innerHTML = (language == 0) ? '4 : Poser 6 (dizaine)' : '4 :  Enter 6 (tens)';
				PoseProg(2560 + positionCurseur[0]);    setTimeout(function(){ exempleDivision(pas+1);}, 1500); break ;	
		case 8 : textExemples.innerHTML = (language == 0) ? '5 : Poser 9 (unitÃ©)' : '5 :  Enter 9 (ones)';
				PoseProg(2569);    setTimeout(function(){ exempleDivision(pas+1);}, 1500); break ;	
		case 9 : textExemples.innerHTML = (language == 0) ? '6 : Tourner (0 + 2569)' : '6 : Turn (0 + 2569)';
				initialise();      setTimeout(function(){ exempleDivision(pas+1);}, 5000); break ;	
		case 10 : textExemples.innerHTML = (language == 0) ? '7 : Effacer compteurs' : '7 : Clear the counters';
				appelRAZcompteur();setTimeout(function(){ exempleDivision(pas+1);}, 3000); break ;	
		case 11 : textExemples.innerHTML = (language == 0) ? '8 : Poser 1 (dizaine)' : '8 :  Enter 1 (tens)';
				PoseProg(10 + positionCurseur[0] );      setTimeout(function(){ exempleDivision(pas+1);}, 2000); break ;	
		case 12 : textExemples.innerHTML = (language == 0) ? '9 : Poser 2 (unitÃ©)' : '9 :  Enter 2 (ones)';
				PoseProg(12);      setTimeout(function(){ exempleDivision(pas+1);}, 1500); break ;	
		case 13 : textExemples.innerHTML = (language == 0) ? '10 : Alignement des poids forts' : '10 : Aligment of most significant digits';
				verifDecPlus(2);    setTimeout(function(){ exempleDivision(pas+1);}, 3000); break ;	
		case 14 : textExemples.innerHTML = (language == 0) ? '11 : Engrener Sous-Div' : '11 : Engage Sous-Div' ;
				initRenverseur(); setTimeout(function(){ exempleDivision(pas+1);}, 3000); break ;	
		case 15 : textExemples.innerHTML = (language == 0) ? '12 : Tourner (2569 &#150; 1200)' : '12 : Turn (2569 &#150; 1200)';
				initialise();     setTimeout(function(){ exempleDivision(pas+1);}, 3000); break ;	
		case 16 : textExemples.innerHTML = (language == 0) ? '13 : Tourner (1369 &#150; 1200)' : '13 : Turn (1369 &#150; 1200)';
				initialise();     setTimeout(function(){ exempleDivision(pas+1);}, 3000); break ;	
		case 17 : textExemples.innerHTML = (language == 0) ? '14 : DÃ©caler Ã  gauche' : '14 : Shift carriage left';
				verifDecMoins(1);  setTimeout(function(){ exempleDivision(pas+1);}, 2000); break ;	
		case 18 : textExemples.innerHTML = (language == 0) ? '15 : Tourner (169 &#150; 120)' : '15 : Turn (169 &#150; 120)';
				initialise();     setTimeout(function(){ exempleDivision(pas+1);}, 3000); break ;	
		case 19 : textExemples.innerHTML = (language == 0) ? '16 : DÃ©caler Ã  gauche' : '16 : Shift carriage left';
				verifDecMoins(1);  setTimeout(function(){ exempleDivision(pas+1);}, 2000); break ;	
		case 20 : textExemples.innerHTML = (language == 0) ? '17 : Tourner (49 &#150; 12)' : '17 : Turn (49 &#150; 12)';
				initialise();     setTimeout(function(){ exempleDivision(pas+1);}, 3000); break ;	
		case 21 : textExemples.innerHTML = (language == 0) ? '18 : Tourner (37 &#150; 12)' : '18 : Turn (37 &#150; 12)';
				initialise();     setTimeout(function(){ exempleDivision(pas+1);}, 3000); break ;	
		case 22 : textExemples.innerHTML = (language == 0) ? '19 : Tourner (25 &#150; 12)' : '19 : Turn (25 &#150; 12)';
				initialise();     setTimeout(function(){ exempleDivision(pas+1);}, 3000); break ;	
		case 23 : textExemples.innerHTML = (language == 0) ? '20 : Tourner (13 &#150; 12)' : '20 : Turn (13 &#150; 12)';
				initialise();     setTimeout(function(){ exempleDivision(pas+1);}, 3000); break ;	
		case 24 : textExemples.innerHTML = (language == 0) ? '2 569 &#247; 12 = 214 reste 1' : '2 569 &#247; 12 = 214 remain 1';
				initRenverseur(); setTimeout(function(){ exempleDivision(pas+1);},10000); break ;	
		case 25: textExemples.innerHTML = ''; document.getElementById('titreExemples').innerHTML = '';
				enCoursEx = false; toutBloquer(false); VuExemple(true);				 
				 if (document.getElementById('boucle').checked) exempleAddition(1) ; break ;
	 }}
}

var TempsCPU ;
function exemplePropagation (ouvr) {
	if (ouvr) {
		if (! enCours){
			if(document.getElementById('enlvBoite').innerHTML == "Enlever le boÃ®tier") {enleverBoite(); remetreBoite = true} ;
			if(document.getElementById('enlvChariot').innerHTML == "Ouvrir le chariot") {degagerChariot() ; remetreChariot = true} ;
			PoseIm (999999) ;
			initialise() ;
			helpWindow.document.open() ;
			helpWindow.document.write(hautDePage) ;
			helpWindow.document.write(helpPage[language][6]) ;
			if (dureeTour == undefined) {
				helpWindow.document.write((language == 0) ? '<br><i>Cliquez encore une fois le bouton 999999</i>' : '<br><i>Click the button 999999 one more time</i>') ;
				TempsCPU = '' ;
				} else { TempsCPU += (language == 0) ? '<br><i>Temps CPU du dernier tour de manivelle : ' : '<br><i>CPU time of the last crank turn : ' ; 
						TempsCPU += dureeTour + ' millisecondes.</i>' ; 
						helpWindow.document.write(TempsCPU)
			} ;
			helpWindow.document.write(basDePage[language]) ;
			helpWindow.document.close() ;
		}
	} else {
		TempsCPU = '' ;
		if (remetreBoite) enleverBoite() ;
		if (remetreChariot) degagerChariot() ;
		remetreBoite = remetreChariot = false ;
	}
}

function toutBloquer(tblq){
	document.getElementById("remiseZero").disabled = tblq;
	document.getElementById("remiseZeroCompteur").disabled = tblq;
	document.getElementById("razCurseur").disabled = tblq;	
	document.getElementById("bTourner").disabled = tblq;
	document.getElementById("bDecPlus").disabled = (tblq || positionDecalage == 6) ;
	document.getElementById("bDecMoins").disabled = (tblq || positionDecalage == 0);
	document.getElementById("bAddition").disabled = tblq;
	document.getElementById("bSoustraction").disabled = tblq;
	document.getElementById("bMultiplication").disabled = tblq;
	document.getElementById("bDivision").disabled = tblq;
	toucheBloque = tblq;
}

function VuExemple (seVoit){
	document.getElementById('imbAddition').style.visibility = (seVoit ? 'visible' : 'hidden') ;
	document.getElementById('imbSoustraction').style.visibility = (seVoit ? 'visible' : 'hidden') ;
	document.getElementById('imbMultiplication').style.visibility = (seVoit ? 'visible' : 'hidden') ;
	document.getElementById('imbDivision').style.visibility = (seVoit ? 'visible' : 'hidden') ;
}

function razCurseur(){
	PoseProg(0) ;
}

var assemblerPause = 0 ;

var ordreMontage = [ 		
		-2, -1, -3, -1,-1, -4, -1,-1,-1,   // montage de 26
                  		-54, -55, -56, -57, -58,			 // cylindes et engrenages
		-62, -64,             				 // 2 axes sans cylindre
		-21, -1,-1, -22, -1,-1, -23, -24, -25, -26, 
		-27, -28, -29, -30, 29, -1, 38, -1,  // arbre commun  manivelle		
		-6, -59, -31, -32, -33, -34, -35, -36,		 // axes des baladeurs nus
		76,75,74,73,72,71,                   // baladeur des curseurs de pose
		 -7, -65, -1, -60, -63, -1,		     // axes 37 et 36
		-42, -48, -1, -43, -49, -1, 
		-44, -50, -1, -45, -51, -1,          // malte et lunules alternÃ©es
		-46, -52, -1, -47, -53, -1,
		-8,62,-1,-61,61,-1,-37,				 // curseurs et engrenage retenue
		60,-1,-38,59,-1,-39,	  			 // curseurs et engrenage retenue
		58,-1,-40,57,-1,-41,56,-1,55,
		96,89,95,88,94,87,93,                // reset et set bascules retenue
		86,92,85,91,84,90,83,
		70,69,68,67,66,65,64,63,             // double engrenages
		-15, -1,-1, -16, -1,-1, -17, 41,     // barre AddSub
		-18, -1,-1, -19, -1,-1,-20,80,82,78, // bouton, crÃ©mailÃ©re
		-9, -1,-1, -10, -1,-1, -11, -1,-1,   // montage de 3
		-12, -1,-1, -13, -1,
		3,2,1,11,10,9,8,7,6,5,4,0,           // accumulateurs
		81,79,                               // Cremaillere RAZ compteurs
		20,19,18,17,16,15,14,                // compteurs tours
		12,13,                               // inverseurs
		54,53,52,51,50,49,                   // curseurs pose
		42,43,44,46,47,45,40,39              // boitier
		];

function assemblerAri(){
	if (assemblerPause == 0){
		document.getElementById("Assembler").innerHTML = '&nbsp;Pause&nbsp;' ;
		for(i = 0; i < ordreMontage.length; i++){ 
			if (ordreMontage[i] >=0) {objects[ordreMontage[i]].visible = false;}
		}
		for (i = 30; i <= 37; i++)  {objects[i].visible = false;}
		for (i = 21; i <= 28; i++)  {objects[i].visible = false;}		
		assemblerProg(0) ; assemblerPause = 1 ;
	} else {
		if (assemblerPause == 1) {assemblerPause = 2; document.getElementById("Assembler").innerHTML = 'Assemble' ; }
		else {assemblerPause = 1 ; document.getElementById("Assembler").innerHTML = '&nbsp;&nbsp;&nbsp;Pause&nbsp;&nbsp;&nbsp;' ; }		
	} 
}

function assemblerProg(etape){	
	if (ordreMontage[etape] < -1) {
		var k = - ordreMontage[etape] ;
		switch ( k ) {
		case 2 : objects[26].visible = true ;
			for (var i=1; i<=3; i++) {objects[26].children[i].visible = false ;}
			break ;
		case 3 : objects[26].children[1].visible = true ; break ;
		case 4 : objects[26].children[2].visible = true ; break ;
		case 5 : objects[26].children[3].visible = true ; break ;
		case 6 : objects[37].visible = true ;
			objects[37].children[1].children[0].visible = false ;
			objects[37].children[1].children[1].visible = false ;
			break ;
		case 7 : objects[37].children[1].children[0].visible = true ; break ;
		case 8 : objects[37].children[1].children[1].visible = true ; break ;
		case 9 : objects[3].visible = true ;
			for (var i=0; i<=4; i++) {objects[3].children[i].visible = false ;} break ;
		case 10 : objects[3].children[0].visible = true ;  //axe
				  objects[3].children[4].visible = true ; break ; 
		case 11 : objects[3].children[2].visible = true ; break ; // engrenage
		case 12 : objects[3].children[3].visible = true ; break ; // engrenage		
		case 13 : objects[3].children[1].visible = true ; break ; // roue numerotee
		case 14 : break ;
		case 15 : objects[82].visible = true ;
				  objects[82].children[0].visible = false ;
				  objects[82].children[1].visible = false ; break ;
		case 16 : objects[82].children[1].visible = true ; break ;
		case 17 : objects[82].children[0].visible = true ; break ;
		case 18 : objects[80].visible = true ;
				  objects[80].children[0].visible = false ;
				  objects[80].children[1].visible = false ; break ;
		case 19 : objects[80].children[0].visible = true ; break ;
		case 20 : objects[80].children[1].visible = true ; break ;
		case 21 : objects[29].visible = true ;
			for (var i=0; i<=8; i++) {objects[29].children[i].visible = false ;}
			break ;
		case 22 : objects[29].children[0].visible = true ; break ; // engrenages coniques
		case 23 : objects[29].children[8].visible = true ; break ;
		case 24 : objects[29].children[7].visible = true ; break ;
		case 25 : objects[29].children[6].visible = true ; break ;		
		case 26 : objects[29].children[5].visible = true ; break ;
		case 27 : objects[29].children[4].visible = true ; break ;
		case 28 : objects[29].children[3].visible = true ; break ;
		case 29 : objects[29].children[2].visible = true ; break ;
		case 30 : objects[29].children[1].visible = true ; break ;		
		case 31 : case 32: case 33: case 34: case 35: k -= 31 ;     // axes balladeurs nus
			objects[35-k].visible = true ;
			objects[35-k].children[1].children[0].visible = false ; 
			objects[35-k].children[1].children[1].visible = false ; break ;
		case 36 : objects[30].visible = true ;
			objects[30].children[1].children[0].visible = false ; // malte
			objects[26].children[3].visible = false ; break ;			
		case 37 : case 38: case 39: case 40: case 41: k -= 37 ;
			objects[35-k].children[1].children[1].visible = true ; break ; // engrenage retenue			
		break ;	
		case 42 : case 43: case 44: case 45: case 46: case 47: k -= 42 ;
			objects[35-k].children[1].children[0].visible = true ; break ;     // malte
		case 48 : case 49: case 50: case 51: case 52: case 53: k -= 48 ;
			objects[26-k].children[3].visible = true ; break ;                // lunules
		case 54 : case 55: case 56: case 57: case 58: k -= 54 ;
			objects[25-k].visible = true ;
			objects[25-k].children[3].visible = false ; break ;
		case 59 : objects[36].visible = true ;
			objects[36].children[1].children[0].visible = false ;
			objects[36].children[1].children[1].visible = false ;
			break ;
		case 60 : objects[36].children[1].children[0].visible = true ; break ;
		case 61 : objects[36].children[1].children[1].visible = true ; break ;
		case 62 : objects[27].visible = true ;
			objects[27].children[2].visible = false ; 
			break ;
		case 63 : objects[27].children[2].visible = true ; break ;
		case 64 : objects[28].visible = true ;
			objects[28].children[2].visible = false ; 
			break ;
		case 65 : objects[28].children[2].visible = true ; break ;
		
		}
	}	
	if (ordreMontage[etape] >= 0){objects[ordreMontage[etape]].visible = true; }
	if ((assemblerPause < 2) && (ordreMontage[etape] != -1)) {BruitClick2.play() ;}
	if (etape < ordreMontage.length -1) {
		if (assemblerPause == 2 ) {setTimeout(function(){ assemblerProg(etape);}, 200) ;} // attente active
		else {setTimeout(function(){ assemblerProg(etape+1);}, 500) ; }
	}
	else { document.getElementById("Assembler").innerHTML = 'Assemblage' ; assemblerPause = 0 } ;

}

