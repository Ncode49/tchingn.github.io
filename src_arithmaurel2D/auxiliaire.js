var pasRAZ = 1/8 ;  // choix 1/8, 1/16, 1/32
tableChiffre = new Array(8) ;
var nbDelai, Delai = 100 ; // millième de seconde
var nbAppelS = 0 ;
var adend1, adend2, adend1b, adend2b ;
var zerodisk, zeroflech, SetFlecDone ;
var textExemples = document.getElementById('textExemples') ;
var arithBisi ;  // arithmaurel occupé
var purge = false ;


//       ctx.canvas.width = img.width;
//       ctx.canvas.height = img.height;
//       ctx.drawImage(img, 0, 0);

function ajustPasRAZ(){
	if (Delai >= 475) {pasRAZ = 1/100}
	else if (Delai >= 350) {pasRAZ = 1/32}
	else if (Delai >= 225) {pasRAZ = 1/16}
	else { pasRAZ = 1/8}
}
function RAZtiret(){
	document.getElementById('tirette').innerHTML = '&nbsp;0&nbsp;0&nbsp;0&nbsp;0&nbsp;0&nbsp;0&nbsp;0&nbsp;&nbsp;0&nbsp;' ;
	for (var i = 7; i >= 0; i--){
		inputTiret[i] = 0 }	
}
	
function RAZflech() {
	for (var i = 0; i < 4; i++){ inputCadr[i] = 0 } ;
	zeroflech = false ;
	baseCadr = 0 ;
	RAZflechBoucle() ;
}
			
function RAZflechBoucle() {
	nonzero = false ;
	document.getElementById('cadran').innerHTML = '&nbsp;' ;
	for (var i = 0; i < 4; i++){
		if (flechAngl[i] > 2*pasRAZ ){
			nonzero = true ;
			flechAngl[i] -= pasRAZ ;
		} else {
			if (flechAngl[i] < - 2*pasRAZ ){
				nonzero = true ;
				flechAngl[i] += pasRAZ ;
			} else {
			flechAngl[i] = 0;				
		} }	
		tourneFlech(i) ;
		document.getElementById('cadran').innerHTML += Math.round(flechAngl[i] / angleUnit / (11/20)) + '&nbsp;' ;
	}
	if (nonzero) {setTimeout(function(){ RAZflechBoucle();}, 100) }
	else { zeroflech = true; document.getElementById('cadran').innerHTML = '&nbsp;0 0 0 0&nbsp;' ; } ;
}


function RAZdisk(j) {
	ctxBout.clearRect(321, 260, 100, 200) ;
	ctxBout.translate(321 + 25, 260 + 81); 
	if (j > 0) {
		for (var i = 0; i < 8; i++){
			if (resultat[i] > j && resultat[i] <= 5){ resultat[i] -= pasRAZ ; 
			} else { if (resultat[i] < 10-j && resultat[i] > 5){ resultat[i] += pasRAZ ;} }
		} 
		tourneDisk() ;
		ctxBout.rotate((5-j) * 0.12);
		zerodisk = false ;
	} else {
		if (j == 0) { 
			zerodisk = true; 
			setTimeout(function(){ RAZdisk(j-pasRAZ);}, 30) ;
			ctxBout.rotate(5 * 0.12);
			for (var i = 0; i < 8; i++){ resulExact[i] = resultat[i] = 0 ; }
		} else {
			if (j > -5) {
				ctxBout.rotate((5+j) * 0.12);
		} } }
	ctxBout.drawImage(masque1, -25, -81) ;
	ctxBout.setTransform(echelle, 0, 0, echelle, 0, 0);
	if (j > -5) {setTimeout(function(){ RAZdisk(j-pasRAZ);}, 30) ;} ;
}

function simulation(mode){ // entrées = data et inputTiret(8), sortie = resultat(8).
// mode = 0 : valeurs entieres : calcul exact, mode = 1 : valeurs non entières: calcul approché
//console.log('Simulation' , mode, inputCadr[3-curCadr] - baseCadr) ;
	for (var j = 0; j < 8; j++){ resultat[j] = resulExact[j] } ;
	for (var j = 0; j < 8 - (3 - curCadr); j++){
		resultat[(3 - curCadr) + j] += (inputCadr[3-curCadr] - baseCadr) * inputTiret [j] ;
	}
	for (var i = 0; i < 8; i++){
		while (resultat[i] >= 10) {resultat[i] -= 10; resultat[i+1] ++  } ;
		while (resultat[i] < 0) {resultat[i] += 10; resultat[i+1] -- } ;
		if (mode == 1 && resultat[i] > 9.1 ){ resultat[i+1] += (resultat[i] -9) } ;
		if (mode == 1 && resultat[i] < -9.1){ resultat[i+1] += (resultat[i] +9) } ;			
	}
	if (mode == 0){ for (var j = 0; j < 8; j++) {resulExact[j] = resultat[j]} }
}

function SETflect (k, val){
	nbDelai = 2 ;
	if (val != inputCadr[3-k]){
		SetFlecDone = false ;
		curCadr = k ;
		nbDelai = 2 + Math.abs(inputCadr[3-curCadr] - val)/pasRAZ ;
		baseCadr = inputCadr[3-curCadr] ;
		SETflectBoucle (val) ;
	}	
}

function SETflectBoucle (val){
//console.log('SETflech', curCadr , val, inputCadr[3-curCadr] ) ;
if (val == inputCadr[3-curCadr]) return ;
	nonzero = false ;
	if (inputCadr[3-curCadr] > val + pasRAZ) {
		inputCadr[3-curCadr] -= pasRAZ ;
//		if (Number.isInteger(inputCadr[3-curCadr])) {simulation(0) ; val ++} else {simulation(1)};
		simulation(1) ;
		nonzero = true ;
	} else {
		if (inputCadr[3-curCadr] < val - pasRAZ) {
			inputCadr[3-curCadr] += pasRAZ ;
			nonzero = true ;
//			if (Number.isInteger(inputCadr[3-curCadr])) {simulation(0); val --} else {simulation(1)};
			simulation(1) ;
		} else {
			inputCadr[3-curCadr] = val ;	
			simulation(0) ;
			SetFlecDone = true ;
		}
	}
	if (Number.isInteger(inputCadr[3-curCadr])){
			for (var i = 0; i < 8; i++){ resultat[i] = Math.round ( resultat[i])}
	}
	flechAngl[curCadr] = inputCadr[3-curCadr] * angleUnit * (11/20) ;
	tourneDisk() ;
	tourneFlech(curCadr) ;
	affichCadran() ;

	if (nonzero){ setTimeout(function(){ SETflectBoucle (val);}, Delai); }
}

function tirage(mode){
// mode 1 : addition, mode 2 : soustraction, mode 3 : multiplication, mode 4 : division
	switch (mode){
	case 1 :
		adend1 = Math.ceil(Math.random() * 50000000) ;
		adend2 = Math.ceil(Math.random() * 50000000) ;
	break ;
	case 2 :
		adend1 = Math.ceil(Math.random() * 100000000) ;
		adend2 = Math.ceil(Math.random() *  10000000) ;
	break ;
	case 3 :
		adend1 = Math.ceil(Math.random() * 10000) ;
		adend2 = Math.ceil(Math.random() * 10000) ;
	break ;
	case 4 :
		adend1 = Math.ceil(Math.random() * 10000000) ;
		adend2 = Math.ceil(Math.random() *    10000) ;
		if (adend2 < 1000) adend2 *= 10 ;
//		adend1 = 9638 ;	adend2 = 3 ;
	break ;
	}
	ajustPasRAZ() ;
}

function pad(val){
	return ('00000' + val).slice(-8) ;
}

function abort(){    // arret prématuré d'une simulation
	document.getElementById('boucle').checked = false ;
	textExemples.innerHTML = '_' ;
	purge = true ;  // purge la simulation en cours
	bisi(false);    // simulation n'est plus busy
}

function exempleAddition(pas){
	if (purge) {purge = false; return }
	switch (pas){
	case 1 :
		if(arithBisi) return ;
		bisi(true);
		tirage(1);
		textExemples.innerHTML = 'Pose d\'un terme : ' + pad(adend1) + ' (avec les tirettes)' ;
		RAZtiret(); RAZflech(); RAZdisk(5); 
		poseInput (adend1) ;
		setTimeout(function(){ exempleAddition(pas+1) ;}, nbDelai * Delai);
	break ;
	case 2 :
		if (zerodisk && zeroflech) {setTimeout(function(){ exempleAddition(pas+1) ;}, Delai);}
		else {setTimeout(function(){ exempleAddition(pas) ;}, Delai);}
	break ;
	case 3 :
		SETflect (3,1) ;
		setTimeout(function(){ exempleAddition(pas+1) ;}, nbDelai * Delai);	
	break ;
	case 4 :
		textExemples.innerHTML += '<br>Pose d\'un terme : ' + pad(adend2) + ' (avec les tirettes)';
		poseInput (adend2) ;
		setTimeout(function(){ exempleAddition(pas+1) ;}, nbDelai * Delai);
	break ;
	case 5 :
		SETflect (3,2) ;
		setTimeout(function(){ exempleAddition(pas+1) ;}, nbDelai * Delai);	
	break ;
	case 6 :
		bisi(false);
		textExemples.innerHTML += '<br>Addition : ' + pad(adend1) + ' <b>+</b> ' + pad(adend2) + ' = ' + pad(adend1 + adend2) ; 
		setTimeout(function(){ exempleAddition(pas+1) ;}, 90 * Delai);	// 9000
	break ;
	case 7 : 
		if (!arithBisi) {textExemples.innerHTML = '_' ;  
		if (document.getElementById('boucle').checked) exempleSoustraction(1) }
	break ;
	}
}
	
function exempleSoustraction(pas){
//console.log('Soustraction ', pas) ;
	if (purge) {purge = false; return }
	switch (pas){
	case 1 :
		if(arithBisi) return ;
		bisi(true);
		tirage(2);
		textExemples.innerHTML = 'Pose d\'un addend : ' + pad(adend1) + ' (avec les tirettes)';
		RAZtiret(); RAZflech(); RAZdisk(5); 
for (var j = 0; j < 8; j++){ resulExact[j] = 0} ;
		poseInput (adend1) ;
		setTimeout(function(){ exempleSoustraction(pas+1) ;}, nbDelai * Delai);
	break ;
	case 2 :
		if (zerodisk && zeroflech) {setTimeout(function(){ exempleSoustraction(pas+1) ;}, Delai);}
		else {setTimeout(function(){ exempleSoustraction(pas) ;}, Delai);}
	break ;
	case 3 :
		SETflect (3,1) ;
		setTimeout(function(){ exempleSoustraction(pas+1) ;}, nbDelai * Delai);	
	break ;
	case 4 :
		textExemples.innerHTML += '<br>Pose d\'un subtrahend : ' + pad(adend2) + ' (avec les tirettes)';
		poseInput (adend2) ;
		setTimeout(function(){ exempleSoustraction(pas+1) ;}, nbDelai * Delai);
	break ;
	case 5 :
		SETflect (3,0) ;
		setTimeout(function(){ exempleSoustraction(pas+1) ;},  Delai);	
	break ;
	case 6 :
		bisi(false);
		textExemples.innerHTML += '<br>Soustraction : ' + pad(adend1) + ' ─ ' + pad(adend2) + ' = ' ; 
		textExemples.innerHTML += (adend1 >= adend2) ? pad(adend1-adend2) : (100000000 + adend1-adend2 + ' modulo') ;
		setTimeout(function(){ exempleSoustraction(pas+1) ;}, 100 * Delai);	// 9000
	break ;
	case 7 : 
		if (!arithBisi) {textExemples.innerHTML = '_' ;  
		if (document.getElementById('boucle').checked) exempleMultiplication(1) }
	break ;
	}
}

function exempleMultiplication(pas){
	if (purge) {purge = false; return }
	switch (pas){
	case 1 :
		if(arithBisi) return ;
		bisi(true);
		tirage(3);
		RAZtiret(); RAZflech(); RAZdisk(5); 
		poseInput (adend1) ;
		textExemples.innerHTML = 'Pose d\'un multiplicande : ' + pad(adend1) + ' (avec les tirettes)' ;
		setTimeout(function(){ exempleMultiplication(pas+1) ;}, nbDelai * Delai);
	break ;
	case 2 :
		if (zerodisk && zeroflech) {setTimeout(function(){ exempleMultiplication(pas+1) ;}, Delai);}
		else {setTimeout(function(){ exempleMultiplication(pas) ;}, Delai);}
	break ;
	case 3 :		
		textExemples.innerHTML += '<br>Pose d\'un multiplieur : ' + adend2 + ' (avec les aiguilles)' ;
		SETflect (0,(Math.trunc(adend2/1000))%10) ;
		setTimeout(function(){ exempleMultiplication(pas+1) ;}, nbDelai * Delai);	
	break ;
	case 4 :
		if (! SetFlecDone) {setTimeout(function(){ exempleMultiplication(pas) ;},Delai);}
		else {
			SETflect (1,(Math.trunc(adend2/100))%10) ;
			setTimeout(function(){ exempleMultiplication(pas+1) ;}, nbDelai * Delai);}	
	break ;
	case 5 :
		if (! SetFlecDone) {setTimeout(function(){ exempleMultiplication(pas) ;},Delai);}
		else {	
			SETflect (2,(Math.trunc(adend2/10))%10) ;
			setTimeout(function(){ exempleMultiplication(pas+1) ;}, nbDelai * Delai);}	
	break ;
	case 6 :
		if (! SetFlecDone) {setTimeout(function(){ exempleMultiplication(pas) ;},Delai);}
		else {
			SETflect (3,adend2%10) ;
			setTimeout(function(){ exempleMultiplication(pas+1) ;}, nbDelai * Delai); }	
	break ;
	case 7 :
		bisi(false);
		textExemples.innerHTML += '<br>Multiplication : ' + pad(adend1) + ' <b>×</b> ' + adend2 + ' = ' + pad(adend1 * adend2) ; 
		setTimeout(function(){ exempleMultiplication(pas+1) ;}, 100 * Delai);	// 9000
	break ;
	case 8 : 
		if (!arithBisi) {textExemples.innerHTML = '_' ;  
		if (document.getElementById('boucle').checked) exempleDivision(1) }
	break ;
	}
}

function exempleDivision(pas){
	if (purge) {purge = false; return }
	switch (pas){
	case 1 :
		if(arithBisi) return ;
		bisi(true);
		tirage(4);
		RAZtiret(); RAZflech(); RAZdisk(5); 
		poseInput (adend1) ;
		textExemples.innerHTML = 'Pose d\'un dividende : ' + pad(adend1) + ' (avec les tirettes)' ;
		setTimeout(function(){ exempleDivision(pas+1) ;}, nbDelai * Delai);
	break ;
	case 2 :
		if (zerodisk && zeroflech) {setTimeout(function(){ exempleDivision(pas+1) ;}, Delai);}
		else {setTimeout(function(){ exempleDivision(pas) ;}, Delai);}
	break ;
	case 3 :
		SETflect (3,1) ;
		setTimeout(function(){ exempleDivision(pas+1) ;}, nbDelai * Delai);	
	break ;
	case 4 :
		textExemples.innerHTML += '<br>Pose d\'un diviseur : ' + pad(adend2) + ' (avec les tirettes)' ;
		poseInput (adend2) ;
		setTimeout(function(){ exempleDivision(pas+1) ;}, nbDelai * Delai);
	break ;
	case 5 :
		RAZflech() ; // remetre à 0 sans calcul
		setTimeout(function(){ exempleDivision(pas+1) ;}, 2000);	
	break ;	
	case 6 :
		SETflect (0,-((Math.trunc(adend1/adend2/1000))%10)) ;
		setTimeout(function(){ exempleDivision(pas+1) ;}, nbDelai * Delai); // pas+1	
	break ;
	case 7 :
		if (! SetFlecDone) {setTimeout(function(){ exempleDivision(pas) ;},Delai);}
		else {
			SETflect (1,-((Math.trunc(adend1/adend2/100))%10)) ;
			setTimeout(function(){ exempleDivision(pas+1) ;}, nbDelai * Delai);}
	break ;
	case 8 :
		if (! SetFlecDone) {setTimeout(function(){ exempleDivision(pas) ;},Delai);}
		else {
			SETflect (2,-((Math.trunc(adend1/adend2/10))%10)) ;
			setTimeout(function(){ exempleDivision(pas+1) ;}, nbDelai * Delai);	}
	break ;
	case 9 :
		if (! SetFlecDone) {setTimeout(function(){ exempleDivision(pas) ;},Delai);}
		else {
			SETflect (3,-((Math.trunc(adend1/adend2))%10)) ;
			setTimeout(function(){ exempleDivision(pas+1) ;}, nbDelai * Delai);	}
	break ;
	case 10 :
		if (! SetFlecDone) {setTimeout(function(){ exempleDivision(pas) ;},Delai);}
		else {
			bisi(false);
			textExemples.innerHTML += '<br>Division : ' + adend1 + ' <b>÷</b> ' + adend2 + ' = ' + (Math.trunc(adend1 / adend2)) + ' reste ' + pad(adend1 % adend2) ; 	
			setTimeout(function(){ exempleDivision(pas+1) ;}, 100 * Delai);	} // 9000
	break ;
	case 11 : 
		if (!arithBisi) {textExemples.innerHTML = '_' ;  
		if (document.getElementById('boucle').checked) exempleSigma(1) }
	break ;
	
	}
}

function exempleSigma(pas){
	if (purge) {purge = false; return }
	switch (pas){
	case 1 :
		if(arithBisi) return ;
		bisi(true);
		tirage(3);
		adend1b = adend1 ; adend2b = adend2 ;
		RAZtiret(); RAZflech(); RAZdisk(5); 
		poseInput (adend1) ;
		textExemples.innerHTML = 'Premier multiplicande : ' + pad(adend1) + ' (avec les tirettes)' ;
		setTimeout(function(){ exempleSigma(pas+1) ;}, nbDelai * Delai);
	break ;
	case 2 :
		if (zerodisk && zeroflech) {setTimeout(function(){ exempleSigma(pas+1) ;}, Delai);}
		else {setTimeout(function(){ exempleSigma(pas) ;}, Delai);}
	break ;
	case 3 :		
		textExemples.innerHTML += '<br>Premier multiplieur : ' + adend2 + ' (avec les aiguilles)' ;
			SETflect (0,(Math.trunc(adend2/1000))%10) ;
			setTimeout(function(){ exempleSigma(pas+1) ;}, nbDelai * Delai);	
	break ;
	case 4 :
		if (! SetFlecDone) {setTimeout(function(){ exempleSigma(pas) ;},Delai);}
		else {
			SETflect (1,(Math.trunc(adend2/100))%10) ;
			setTimeout(function(){ exempleSigma(pas+1) ;}, nbDelai * Delai); }	
	break ;
	case 5 :
		if (! SetFlecDone) {setTimeout(function(){ exempleSigma(pas) ;},Delai);}
		else {
			SETflect (2,(Math.trunc(adend2/10))%10) ;
			setTimeout(function(){ exempleSigma(pas+1) ;}, nbDelai * Delai);}	
	break ;
	case 6 :
		if (! SetFlecDone) {setTimeout(function(){ exempleSigma(pas) ;},Delai);}
		else {
			SETflect (3,adend2%10) ;
			setTimeout(function(){ exempleSigma(pas+1) ;}, nbDelai * Delai); }	
	break ;
	case 7 :
		RAZflech(); 
		textExemples.innerHTML += '<br>Premier produit : ' + pad(adend1b) + ' <b>×</b> ' + adend2b + ' = ' + pad(adend1b * adend2b) ; 
		setTimeout(function(){ exempleSigma(pas+1) ;}, nbDelai*Delai);	
	break ;		
// Deuxieme produit	
	case 8 :
		tirage(3);
		RAZtiret();
		poseInput (adend1) ;
		textExemples.innerHTML = 'Second multiplicande : ' + pad(adend1) + ' (avec les tirettes)' ;		
		setTimeout(function(){ exempleSigma(pas+1) ;}, nbDelai * Delai);
	break
	case 9 :
		if (zeroflech) {setTimeout(function(){ exempleSigma(pas+1) ;}, Delai);}
		else {setTimeout(function(){ exempleSigma(pas) ;}, Delai);}
	break ;
	case 10 :		
		textExemples.innerHTML += '<br>Second multiplieur : ' + adend2 + ' (avec les aiguilles)' ;
		SETflect (0,(Math.trunc(adend2/1000))%10) ;
		setTimeout(function(){ exempleSigma(pas+1) ;}, nbDelai * Delai);	
	break ;
	case 11 :
		if (! SetFlecDone) {setTimeout(function(){ exempleSigma(pas) ;},Delai);}
		else {
			SETflect (1,(Math.trunc(adend2/100))%10) ;
			setTimeout(function(){ exempleSigma(pas+1) ;}, nbDelai * Delai);}	
	break ;
	case 12 :
		if (! SetFlecDone) {setTimeout(function(){ exempleSigma(pas) ;},Delai);}
		else {
			SETflect (2,(Math.trunc(adend2/10))%10) ;
			setTimeout(function(){ exempleSigma(pas+1) ;}, nbDelai * Delai);}	
	break ;
	case 13 :
		SETflect (3,adend2%10) ;
		setTimeout(function(){ exempleSigma(pas+1) ;}, nbDelai * Delai);	
	break ;
	case 14 : 
		bisi(false);
		textExemples.innerHTML += '<br>Sigma : (' + adend1b + ' <b>×</b> ' + adend2b + ') <b>+</b> (' + adend1 + ' <b>×</b> ' + adend2 + ') = ' + pad(adend1b*adend2b+adend1*adend2); 
		setTimeout(function(){ exempleSigma(pas+1) ;}, 200 * Delai);	
	break ;			
	case 15 :
		if (!arithBisi) {textExemples.innerHTML = '_' ;  
		if (document.getElementById('boucle').checked) exempleAddition(1) }
	break ;
	}
}

function bisi(tblq){
//console.log ('bisi', tblq) ;
	arithBisi = tblq ;
	document.getElementById('bAddition').disabled = tblq ;
	document.getElementById('bSoustraction').disabled = tblq ;
	document.getElementById('bMultiplication').disabled = tblq ;
	document.getElementById('bDivision').disabled = tblq ;
 	document.getElementById('imbAddition').style.visibility = (tblq ? 'hidden' : 'visible' ) ;
	document.getElementById('imbSoustraction').style.visibility = (tblq ? 'hidden' : 'visible' ) ;
	document.getElementById('imbMultiplication').style.visibility = (tblq ? 'hidden' : 'visible' ) ;
	document.getElementById('imbDivision').style.visibility = (tblq ? 'hidden' : 'visible' ) ;
	document.getElementById('imbSigma').style.visibility = (tblq ? 'hidden' : 'visible' ) ;
}

function poseInput(nbre){
	nbDelai = 1 ;
	var temp = nbre ;
	for (var i = 0; i < 8; i++){
		tableChiffre[i] = temp % 10 ;
		temp = Math.trunc(temp / 10) ;
		nbDelai += Math.abs(inputTiret[i] - tableChiffre[i] )
	}
	poseInputBoucle(7) ;
}

function poseInputBoucle(j){
//console.log ('pose', j , inputTiret[j], nbDelai) ;
	if (tableChiffre[j] > inputTiret[j]){
		inputTiret[j] ++ ;
		affichTiret(0) ;
		setTimeout(function(){ poseInputBoucle(j);}, Delai);
	} else {
	if (tableChiffre[j] < inputTiret[j]){
		inputTiret[j] -- ;
		affichTiret(0) ;
		setTimeout(function(){ poseInputBoucle(j);}, Delai);
	} else {
	if (tableChiffre[j] == inputTiret[j] && j > 0){
		setTimeout(function(){ poseInputBoucle(j-1);}, 50);
	}}}
}

function bigImg(x) {
	if (x == null) return;
    x.style.height = "120%";
    x.style.width = "120%";
	setTimeout(function(){bigImg2(x);}, 100);
}
function bigImg2(x) {
    x.style.height = "140%";
    x.style.width = "140%";
}
function smallImg(x) {
	if (x == null) return;
    x.style.height = "120%";
    x.style.width = "120%";
	setTimeout(function(){smallImg2(x);}, 100);
}
function smallImg2(x) {
    x.style.height = "100%";
    x.style.width = "100";
}
