var helpCurPage = 0 ;
var helpWindow ;
var helpPage = [[],[]] ;
var basDePage = [] ;
var calculatorWindow, extractorWindow, ontheflyWindow ;

function popupCalculette() {
	document.getElementById('boucle').checked = false ; // stop l'execution des exemples en boucle
	if (extractorWindow != null && extractorWindow.open) extractorWindow.close() ;
	if (ontheflyWindow != null && ontheflyWindow.open) ontheflyWindow.close() ;
	if (calculatorWindow == null || calculatorWindow.closed) calculatorWindow = window.open('calculator.html','calculette','menubar=no,status=no,scrollbars=no,resizable=yes,toolbar=no, width=290, height=500');
	calculatorWindow.focus() ;
}

function popupExtraction() {
	document.getElementById('boucle').checked = false ;
	if (calculatorWindow != null && calculatorWindow.open) calculatorWindow.close() ;
	if (ontheflyWindow != null && ontheflyWindow.open) ontheflyWindow.close() ;
	if (extractorWindow == null || extractorWindow.closed) extractorWindow = window.open('squareroot.html','racine carrée','menubar=no,status=no,scrollbars=no,resizable=yes,toolbar=no, width=290, height=500');
	extractorWindow.focus() ;
}

function popupOnthefly() {
	document.getElementById('boucle').checked = false ;
	if (calculatorWindow != null && calculatorWindow.open) calculatorWindow.close() ;
	if (extractorWindow != null && extractorWindow.open) extractorWindow.close() ;
	if (ontheflyWindow == null || ontheflyWindow.closed) ontheflyWindow = window.open('onthefly.html','multiplication à la volée','menubar=no,status=no,scrollbars=no,resizable=yes,toolbar=no, width=200, height=300');
	ontheflyWindow.focus() ;
}

function focusCalculette() {
	if (calculatorWindow != null && calculatorWindow.open) {calculatorWindow.focus()} ;
	if (extractorWindow != null && extractorWindow.open) {extractorWindow.focus()} ;
	if (ontheflyWindow != null && ontheflyWindow.open) {ontheflyWindow.focus()} ;
}

function help(){
	helpWindow = window.open('help.html','help','menubar=no,scrollbars=yes,Width=500,Height=650,resizable') ;
	helpWindow.focus() ;
	helpSpit (0) ;
}

window.onunload = function(){
	if (calculatorWindow && ! calculatorWindow.closed) calculatorWindow.close() ;
	if (extractorWindow != null && extractorWindow.open) extractorWindow.close() ;
	if (ontheflyWindow != null && ontheflyWindow.open) ontheflyWindow.close() ;
	if (helpWindow && ! helpWindow.closed) helpWindow.close() ;	
}

function helpNavig (mvt){
	if (helpCurPage == 6) {exemplePropagation(false)} ;
	if (mvt == 0) {helpCurPage = 0} 
	else {helpCurPage += mvt ; if (helpCurPage == 9) { helpCurPage += mvt } } ; // la page 9 est vide
	if (helpCurPage < 0 || helpCurPage >= helpPage[0].length) {helpCurPage = 0} ;
	helpSpit (helpCurPage) ;
}

function helpSpit (pgn){
	helpCurPage = pgn ;
	helpWindow.document.open() ;
	helpWindow.document.write(hautDePage) ;
	helpWindow.document.write(helpPage[language][pgn]) ;
	if (pgn > 0) {helpWindow.document.write(basDePage[language])} ;
	helpWindow.document.close() ;	
}

function helpArtitcle () {
	window.open('http://www.aconit.org/histoire/calcul_mecanique/documents/arithmom%C3%A8tre_virtuel.pdf', '_blanc') ;

}

hautDePage =  '<html><head><title>Notice Arithmomètre</title><meta charset="utf-8"/><style>body{font-size: 12px}</style>' ;
hautDePage += '<link rel="stylesheet" type="text/css" href="style2.css"/><link rel="icon" type="jpg/png" href="images/favicon.png" /></head> ';
hautDePage += '<body background = "images/bgressor.gif" style = "margin-left:50">' ;
	
basDePage[0] =  '<br><br><br>-<div class="helpFlech"><table width="100%">' ;	
basDePage[0] += '<td align="center">Page précédente<br> <img src="images/prev.gif" id="prev" onclick="window.opener.helpNavig(-1)"></td>' ;	
basDePage[0] += '<td align="center" >Index<br> <img src="images/info.gif" id="info" onclick="window.opener.helpNavig(0)"></td>' ;
basDePage[0] += '<td align="center" >Page suivante<br> <img src="images/next.gif" id="next" onclick="window.opener.helpNavig(1)"></td></table></div></body></html>' ;
			
basDePage[1] =  '<br><br><br>-<div class="helpFlech"><table width="100%">' ;	
basDePage[1] += '<td align="center">Previous page<br> <img src="images/prev.gif" id="prev" onclick="window.opener.helpNavig(-1)"></td>' ;	
basDePage[1] += '<td align="center" >Index<br> <img src="images/info.gif" id="info" onclick="window.opener.helpNavig(0)"></td>' ;
basDePage[1] += '<td align="center" >Next page<br> <img src="images/next.gif" id="next" onclick="window.opener.helpNavig(1)"></td></table></div></body></html>' ;
			
helpPage[0][0]  = '<h1><center>Sommaire de l’aide</center></h1><br><br><ul>'
 + '<li><a href="#" onclick="window.opener.helpSpit(1);">Brève histoire de l’arithmomètre</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(2);">Présentation du modèle 3D de l’arithmomètre</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(3);">Manipulation du modèle 3D de l’arithmomètre</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(4);">Manipulation des curseurs, manivelle et chariot</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(5);">Exemples d’opérations arithmétiques</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(6);">Effectuer une addition ou une soustraction</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(7);">Effectuer une multiplication</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(8);">Effectuer une division</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(10);">Transferts</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(11);">Calculette</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(12);">Extraction de racine carrée</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(13);">Multiplication "à la volée"</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(14);">Expresssions remarquables</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(15);">Calculer avec des nombres de 12 chiffres</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(16);">Effaceur</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(17);">Cylindre de Leibniz</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(18);">Croix de Malte</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(19);">Navette de retenue</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(20);">Auteurs et maintenance</a></li>' 
 + '<li><a href="#" onclick="window.close();">Fermer cette page</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpArtitcle();">Article de \'arts mécaniques\' sur l’arithmomètre 3D</a></li></ul>' ;
 
helpPage[1][0]  = '<h1><center>Help summary</center></h1><br><br><ul>'
 + '<li><a href="#" onclick="window.opener.helpSpit(1);">Brief history of Thomas\' arithmometer</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(2);">Presentation of the 3D model of the arithmometer</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(3);">Manipulation of the 3D model of the arithmometer</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(4);">Handling sliders, crank and carriage</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(5);">Examples of arithmetic operations</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(6);">Perform add or subtract</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(7);">Perform a multiplication</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(8);">Perform a division</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(10);">Transfers</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(11);">Calculator</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(12);">Square root extraction</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(13);">Multiplication "on the fly"</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(14);">Remarkable expressions</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(15);">Calculate with 12-digits numbers</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(16);">Eraser</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(17);">Leibniz stepped drum</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(18);">Malta\'s cross</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(19);">Carry  shuttle</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpSpit(20);">Authors and maintenance</a></li>' 
 + '<li><a href="#" onclick="window.close();">Close this page</a></li>' 
 + '<li><a href="#" onclick="window.opener.helpArtitcle();">Article from \'arts mécaniques\' on the 3D arithmometre (in french)</a></li></ul>' ;

helpPage[0][1]  = '<h1><center>Histoire de l\'arithmomètre<center></h1><br>'
 + 'L’arithmomètre, ou arithmomètre du chevalier Charles-Xavier Thomas de Colmar, fut la première machine à calculer commercialisée au monde et, pendant près de quarante ans, il sera le seul type de machine à calculer disponible à la vente.<br>' 
 + 'Ce calculateur permettait d’additionner ou de soustraire totalement automatiquement et semi-automatiquement de multiplier et diviser grâce à un "chariot mobile".<br>' 
 +'Inventé en France par Thomas de Colmar en 1820, il fut commercialisé de 1851 à 1915. Sa simplicité, sa fiabilité et à sa robustesse lui permirent d’être la première machine à calculer utilisée quotidiennement ' 
 + 'dans un bureau et donc, pour la première fois à partir de 1851, des banques, des compagnies d’assurances et les bureaux du gouvernement commencèrent à utiliser une machine à calculer: l’arithmomètre, ' 
 + 'dans leurs opérations journalières.<br>Il y eut une vingtaine de compagnies qui construisirent des clones de l’arithmomètre, toutes en Europe, avec Burkhardt en 1878 puis Layton, Saxonia, Gräber, Peerless, Mercedes-Euklid, XxX, Archimedes, TIM, Bunzel, Austria, Tate, Madas etc.<br>' 
 + 'Ce modèle 3D est basé sur l’arithmomètre P1 fabriqué par Louis Payen en 1887.<br>Sources Wikipédia et <a href="http://www.arithmometre.org" target="_blank">arithmomètre.org</a>.' ;

 helpPage[1][1]  = '<h1><center>History of the arithmometer<center></h1><br>'
 + 'The arithmometer, or arithmometer of Charles-Xavier Thomas knight of Colmar, was the first commercial mechanical calculator in the world and, for nearly forty years, it was be the only type of calculator available for sale.<br>' 
 + 'The calculator supports fully automatic addition and subtraction, and semi-automatic multiplication and division, thanks to a “mobile carriage”.<br>' 
 +'Invented in France by Thomas de Colmar in 1820, it was marketed from 1851 to 1915. Because of its simplicity, reliability and robustness it became the first calculator used daily in an office environment ' 
 + 'and thus, from 1851, banks, insurance companies and government offices first began using a calculating machine: the arithmometer, in their daily operations. ' 
 + 'There were about twenty companies that built clones of the arithmometer, all in Europe, with Burkhardt in 1878 then Layton, Saxonia, Gräber, Peerless, Mercedes-Euklid, XxX, Archimedes, TIM, Bunzel, Austria, Tate, Madas etc.<br>' 
 + 'This 3D model is based on the P1 arithmometer manufactured by Louis Payen in 1887. Sources Wikipedia and <a href="http://www.arithmometre.org" target="_blank">arithmometre.org</a>.' ;

helpPage[0][2]  = '<h1><center>Présentation de l\'arithmomètre 3D</center></h1><br>' 
 + 'La partie supérieure, au dessus du pointillé, est un chariot mobile qui peut se déplacer de 6 positions vers la droite. La partie inférieure est fixe.' 
 + '<img src="images/Arith3D.gif" align="right"><br>' 
 + 'Le totalisateur affiche 12 chiffres. De ces 12 chiffres, seuls 8 sont modifiés par une addition/soustraction. Le position de ces 8 chiffres dépend de la position du chariot.<br>' 
 + 'Dessous il y a 7 compteurs de tours de manivelle, indépendants. Le compteur modifié dépend de la position du chariot.<br>' 
 + 'La partie fixe compte 6 curseurs de pose, permettant de poser un nombre de 6 chiffres maximum.<br>' 
 + 'Un tour de manivelle ajoute ou soustrait, selon la position de l’inverseur, le nombre posé au totalisateur, et simultanément incrémente ou décrémente un des compteurs de tours de manivelle.<br>' ; 

 helpPage[1][2]  = '<h1><center>Presentation of the 3D arithmometer</center></h1><br>' 
 + 'The upper part, above the dotted line, is a movable carriage that can move 6 positions to the right. The lower part is fixed.' 
 + '<img src="images/Arith3D.gif" align="right"><br>' 
 + 'The accumulator (totalizer) displays 12 digits. Of these 12 digits, only 8 are modified by addition or subtraction. The position of these 8 digits depends on the position of the carriage.<br>' 
 + 'Below there are 7 independent crank turn counters. The modified counter depends on the position of the carriage.<br>' 
 + 'The fixed part has 6 setting sliders, allowing a maximum of 6 digits to be set.<br>' 
 + 'A crank turn either adds or subtracts, depending on the position of the inverter, the number set with the sliders to the accumulator, and simultaneously increments or decrements one of the turn counters.<br>' ; 

helpPage[0][3]  = '<h1><center>Manipulation du modèle 3D</center></h1><br>' 
 + 'Cliquez sur l’arithmomètre 3D avec l’un des 3 boutons de la souris pour contrôler la vue du modèle 3D :' 
 + '<center><img src="images/ControlSouris.png"></center>' 
 + 'Ou bien cliquez sur l’une des 5 vues prédéfinies <i><b>"Face", "Dessus", "Dessous", "Droite"</b> ou <b>"Gauche"</b></i>.<br><br>' 
 + 'Pour voir l’intérieur de l’arithmomètre 3D cliquez le bouton "<i>Enlever le boîtier</i>".<br>' 
 + 'Le bouton "<i>Ouvrir le chariot</i>" dégage le chariot.<br>L’arithmomètre 3D fonctionne même avec son chariot ouvert ou sans son boîtier.<br>' 
 + 'Enfin le bouton "<i>Assemblage</i>" assemble les organes de l’arithmomètre fonction après fonction.<br>'
 + 'Cliquer "<i>Pause</i>" (même bouton) fige l’assemblage, cliquer encore le même bouton reprend l’assemblage.<br>'
 + 'Le dessus de l\'arithmomètre(platine) n\'était pas en bois mais plutôt en laiton ou en laiton argenté, et plus tard en tôle peinte en noir. Vous pouvez choisir le <i>Dessus</i>' ;

 helpPage[1][3]  = '<h1><center>Manipulation of the 3D model</center></h1><br>' 
 + 'Click on the 3D arithmometer with one of the 3 mouse buttons to control the 3D model view :' 
 + '<center><img src="images/ControlSouris.png"></center>' 
 + 'Or click on one of the 5 predefined <i><b>"Front", "Top view", "Bottom", "Right"</b></i> or <i><b>"Left"</b></i> views.<br><br>' 
 + 'To see the inside of the 3D arithmometer click the <i>"Remove the case"</i> button.<br>' 
 + 'The "<i>Open the carriage</i>" button swings open the carriage. The 3D arithmometer works even with its carriage open or without its case.<br>' 
 + 'Finally the button "<i>Assemblage</i>" assembles one by one the parts of the arithmometer function after function.<br>' 
 + 'Click "<i>Pause</i>" (same button) to suspend the assembly, click the button again to resume.<br>' 
 + 'The top of the arithmometer (platen) was not made of wood but rather of brass or silver-plated brass, and later of black painted steel. You can choose the <i>Top</i> material.';

helpPage[0][4]  = '<h1><center>Glisser les curseurs, tourner la manivelle, déplacer le chariot</center></h1><br>' 
 + 'Les curseurs servent à introduire (on disait "poser") la valeur d’un opérande dans l’arithmomètre.<br>' 
 + 'Pour déplacer un curseur, mettre le pointeur de la souris sur le curseur de l’arithmomètre 3D. Quand le curseur est "accroché", le pointeur change d’ic&ocirc;ne.<br>' 
 + 'Déplacez alors la souris en maintenant un bouton de la souris enfoncé (gauche ou droit). Le curseur accroché suit le mouvement du pointeur tant que ce bouton est enfoncé.<br>' 
 + 'Les positions numériques des curseurs sont répétées au bas de l’écran.<br>' 
 + 'En cas de difficulté, on peut aussi utiliser la <i>"Calculette"</i>: taper le nombre désiré suivi de "=", ce nombre apparaît sur les curseurs.<br><br>' 
 + 'Pour basculer l’inverseur entre "Add - Mult" et "Sous -D iv" cliquez dessus.<br>' 
 + 'Pour faire tourner la manivelle cliquez dessus ou bien cliquez sur la flèche circulaire si la manivelle n’est pas visible.<br>' 
 + 'Pour effacer (mettre à zéro) le totalisateur ou les compteurs cliquez les boutons "<i>Effacer le totalisateur</i>" ou "<i>Effacer les compteurs</i>" ' 
 + 'ou bien cliquez les gros boutons gris foncé sur le chariot de l’arithmomètre avec le bouton gauche de la souris.<br>' 
 + 'Pour décaler le chariot cliquez les boutons <b>"<"</b> ou bien <b>">"</b> ou bien cliquez les boutons du chariot avec le bouton droit de la souris.<br>' 
 + 'Pour ramener à zéro tous les curseurs ensemble, cliquer le bouton <i>"Effacer les curseurs"</i>.<br>' ;

 helpPage[1][4]  = '<h1><center>Shift the sliders, turn the crank, move the carriage</center></h1><br>' 
 + 'The sliders are used to set (we say "ask") the value of an operand in the arithmometer.<br>' 
 + 'To move a slider, put the mouse pointer over the slider of the 3D arithmometer. When the slider is "hooked" to the pointer, the pointer icon changes.<br>' 
 + 'Move the mouse while holding down a mouse button (left or right). The hooked slider follows the pointer movement as long as this button is pressed.<br>' 
 + 'The numeric positions of the sliders are repeated at the bottom of the screen.<br>' 
 + 'In case of difficulty, we can also use the "<i>Calculator</i>" : type the desired number followed by "=", this number appears on the sliders. .<br><br>' 
 + 'To toggle the inverter between "Add - Mult" and "Sous - Div" click on it.<br>' 
 + 'To turn the crank click on it or click on the circular arrow if the crank is not visible.<br>' 
 + 'To clear (reset) the accumulator or the counters click the "<i>Clear the accumulator</i>" or "<i>Clear the counters</i>" ' 
 + 'or click the large dark gray buttons on the Arithmometer carriage with the left mouse button.<br>' 
 + 'To shift the carriage click the <b>"<"</b> or <b>">"</b> buttons or right-click the carriage buttons.<br>' 
 + 'To reset all the sliders at once, click the <i>"Clear the sliders"</i> button.<br>' ;

helpPage[0][5]  = '<h1><center>Exemples d’opérations arithmétiques</center></h1><br>' 
 + 'Pour lancer un des exemples de calcul ci-dessous, cliquez le symbole de l’opération correspondant en bas de la page de l’arithmomètre.<br><br>' 
 + '<center><a href="#" onclick="window.opener.exempleAddition(1);">Addition</a> : <i>165 + 328 = 493</i><br><a href="#" onclick="window.opener.exempleSoustraction(1);">Soustraction</a> : <i>324 - 152 = 172</i><br>' 
 + '<a href="#" onclick="window.opener.exempleMultiplication(1);">Multiplication</a> : <i>256 &times; 18 = 4608</i><br><a href="#" onclick="window.opener.exempleDivision(1);">Division</a> : <i>2569 &divide; 12 = 214 reste 1</i></center><br>' 
 + 'Pour enchaîner automatiquement ces exemples, cochez la case "<i>exécuter en boucle</i>". Pour arrêter, décochez la case et attendez que l’opération arithmétique en cours termine son exécution.<br>' 
 + '' ;

 helpPage[1][5]  = '<h1><center>Examples of arithmetic operations </center></h1><br>' 
 + 'To run one of the calculation examples below, click the symbol for the corresponding operation at the bottom of the arithmometer page.<br><br>' 
 + '<center><a href="#" onclick="window.opener.exempleAddition(1);">Addition</a> : <i>165 + 328 = 493</i><br><a href="#" onclick="window.opener.exempleSoustraction(1);">Subtraction</a> : <i>324 - 152 = 172</i><br>' 
 + '<a href="#" onclick="window.opener.exempleMultiplication(1);">Multiplication</a> : <i>256 &times; 18 = 4608</i><br><a href="#" onclick="window.opener.exempleDivision(1);">Division</a> : <i>2569 &divide; 12 = 214 remain 1</i></center><br>' 
 + 'To automatically chain these examples, check the <i>"run in a loop"</i> box. To stop, clear the check box and wait for the current arithmetic operation to complete.<br>' 
 + '' ;

helpPage[0][6]  = '<h1><center>Addition et Soustraction</center></h1><br>' 
 + 'Blaise Pascal avait déjà remarqué vers 1642 qu’une machine effectuant l’addition peut aussi faire la soustraction en inversant le sens de rotation des roues. En fait Pascal s’était contenté d’inscrire ' 
 + 'deux fois les séquences des chiffres sur des cylindre, de 0 à 9 et à côté de 9 à 0. En masquant l’une ou l’autre séquence on passait d’addition à soustraction et réciproquement.<br>' 
 + 'Vers 1777 la machine du comte Charles Stanhope exécute l’addition en deux temps: d’abord l’addition modulo 10 de tous les chiffres indépendamment, en mémorisant les retenues,' 
 + ' puis ensuite propage séquentiellement les retenues. Toutes les calculatrices à manivelle utiliseront ce principe.<br><br>' 
 + 'Le bouton ci-dessous enlève le boîtier et le chariot puis additionne 999999 au totalisateur. Observez le mouvement des navettes de retenue chaque fois qu’on clique ce bouton.<br><br>' 
 + '<button id="Bouton" onclick="window.opener.exemplePropagation(true)"><i>Additionner 999999</i></button><br>' ;

 helpPage[1][6]  = '<h1><center>Addition and Subtraction</center></h1><br>' 
 + 'Blaise Pascal had already noticed around 1642 that a machine performing an addition can also do a subtraction by reversing the direction of rotation of the wheels. In fact, Pascal had merely ' 
 + 'written twice the numbers sequence on the cylinders, from 0 to 9 and close by from 9 to 0. By hiding one or the other sequence we shift from addition to subtraction and vice versa.<br>' 
 + 'Towards 1777 the machine of the count Charles Stanhope executes the addition in two stages: first the addition modulo 10 of all the digits independently, ' 
 + 'then later propagated the carries sequentially. All mechanical calculators will use this principle.<br><br>' 
 + 'The button below removes the case and carriage and adds 999999 to the accumulator. Watch the movement of the shuttles every time you click this button.<br><br>' 
 + '<button id="Bouton" onclick="window.opener.exemplePropagation(true)"><i>Add 999999</i></button><br>' ;

helpPage[0][7]  = '<h1><center>Multiplication</h1><br>' 
 + '<center><span><i>produit = multiplicande </i>&#215<i> multiplieur</i></span></center><br>Bien que la multiplication soit commutative, sa réalisation n’est pas symétrique: le multiplicande est passif, et posé en premier, ' 
 + 'et le multiplieur est actif.<br>Le philosophe et grand savant Gottfried baron de Leibniz a conçu et fait fabriquer en 1694 la première machine à multiplier.<br>Elle est munie d’une manivelle et d’un chariot mobile. ' 
 + 'Le simple déplacement de ce chariot donne :<br><i>multiplicande</i> × 10, <i>multiplicande</i> × 100, <i>multiplicande</i> × 1000 etc.<br>Un tour de manivelle ajoute le chariot au totalisateur.<br>' 
 + 'Vers 1770, un pasteur allemand nommé Hahn a ajouté des roues compteuses de tour de manivelle.<br>Alors si on efface préalablement le totalisateur et les compteurs de tours de l’arithmomètre, on a en permanence:<br><br>' 
 + '<center><span><i>totalisateur = pose </i>&#215<i> compteur</i></span></center><br>' 
 + 'Effectuer une multiplication consiste à poser le multiplicande avec les curseurs puis à inscrire chiffre à chiffre le multiplieur dans les compteurs de tours en se servant de la manivelle et du décalage du chariot. ' 
 + 'Une flèche tracée sur le boîtier de l’arithmomètre pointe sur le chiffre du compteur incrémenté par la manivelle.' ;

 helpPage[1][7]  = '<h1><center>Multiplication</h1><br>' 
 + '<center><span><i>product = multiplicand </i>&#215<i> multiplier</i></span></center><br>Although the multiplication is commutative, its realization is not symmetrical: the multiplicand is passive, and typed first, and the multiplier is active.' 
 + 'The philosopher and great scholar Gottfried baron von Leibniz designed and had manufactured in 1694 the first multiplication machine.<br>It is equipped with a crank and a mobile carriage. The simple movement of this carriage gives: ' 
 + '<br><i>multiplicand</i> × 10, <i>multiplicand</i> × 100, <i>multiplicand</i> × 1000 etc.<br>A turn of the crank adds the carriage to the accumulator.<br>' 
 + 'Around 1770, a German pastor named Hahn added counting crankwheels. So if you first clear the accumulator and the turn counters of the arithmometer, you always have: <br><br>' 
 + '<center><span><i>accumulator = sliders </i>&#215<i> counters</i></span></center><br>' 
 + 'Performing a multiplication consists of asking the multiplicand with the sliders and then entering the value of the multiplier in the turn counters using the crank and the carriage shift. ' 
 + 'An arrow drawn on the case of the arithmometer points to the wheel of the counter that is incremented by the crank.' ;

helpPage[0][8]  = '<h1><center>Division</h1><br>' 
 + '<center><span><i>dividende – reste = diviseur </i>&#215<i> quotient</i></span></center><br>' 
 + 'On initialise l’itération avec <i>reste = dividende</i> et <i>quotient = </i>0 (l’équation est trivialement vraie). Puis on va itérativement construire le <i>quotient</i> jusqu’à ce que 0 <i>&#8804; reste < quotient</i>. ' 
 + 'Comme pour la multiplication on utilise des multiples du <i>diviseur</i> :<br><i>diviseur</i> &#215 1000, <i>diviseur</i> &#215 100, <i>diviseur</i> &#215 10.<br>1 – Amener le <i>dividende</i> (<i>reste</i> initial) dans le chariot.<br>2 – Poser le <i>diviseur</i> avec les curseurs.<br>' 
 + '3 – Décaler le chariot pour aligner les chiffres poids fort du <i>reste</i> et du <i>diviseur</i>.<br>4 – Mette l’inverseur sur "Sous-Div" et itérer les soustractions et décalages.<br>Deux méthodes d’itération :<br>' 
 + '<b>Division sans restauration</b> : on compare à l’œil le <i>reste</i> et le multiple du <i>diviseur</i>. Si le <i>reste</i> est plus grand ou égal, alors on tourne la manivelle pour soustraire, sinon on décale le chariot et recommence.<br>' 
 + '<b>Division avec restauration</b> : on surveille le signe du reste donné par le chiffre du totalisateur au dessus de l’inverseur.<br>Tant que le totalisateur est positif ou nul, on tourne la manivelle pour soustraire.<br>' 
 + 'Si le totalisateur est négatif, on effectue une addition (inverseur + tour + inverseur) pour le <b>restaurer</b> à la dernière valeur positive. Puis on décale le chariot et recommence.<br>' 
 + 'L’opération s’arrête lorsqu’on ne peut plus décaler le chariot.' ;

 helpPage[1][8]  = '<h1><center>Division</h1><br>' 
 + '<center><span><i>dividend – remainder = divisor </i>&#215<i> quotient</i></span></center><br>' 
 + 'We start the iteration with <i>remainder = dividend</i> et <i>quotient = </i>0 (the equation is trivially true). Then we will iteratively build the <i>quotient</i> until 0 <i>&#8804; remainder < quotient</i>. ' 
 + 'As for multiplication we use multiples of the <i>divisor</i> :<br><i>divisor</i> &#215 1000, <i>divisor</i> &#215 100, <i>divisor</i> &#215 10.<br>1 – Bring the <i>dividend</i> ( initial <i>remainder</i> ) into the carriage.<br>2 – Set the <i>divider</i> with the sliders.<br>' 
 + '3 – Shift the carriage to align the most significant digits of the <i>remainder</i> and the <i>divider</i>.<br>4 – Put the inverter on "Sous-Div" and iterate the subtractions and shifts.<br>Two methods of iteration :<br>' 
 + '<b>Division without restoration</b> : we compare the <i>remainder</i> and the <i>divisor</i> multiple with the eye. If the remainder is bigger or equal, then we turn the crank to subtract, otherwise we shift the carriage and start again. .<br>' 
 + '<b>Division with restoration</b> : we watch the sign of the remainder given by the digit of the accumulator above the inverter.<br>As long as the accumulator is positive or zero, the crank is turned to subtract.<br>' 
 + 'When the accumulator becomes negative, an addition (inverter + turn + inverter) is performed to <b>restore it</b> to the last positive value. Then we shift the carriage and start the iteration again.<br>' 
 + 'The iteration stops when the carriage can no longuer be moved' ;

helpPage[0][9]  = '<h1><center>Vide</h1><br>' ;
helpPage[1][9]  = '<h1><center>Empty</h1><br>' ;
 

helpPage[0][10]  = '<h1><center>Transferts</h1><br>' 
 + 'Les transferts ne sont pas à proprement parler des opérations arithmétiques. Ils sont parfois nécessaires car les affichages des opérandes et du résultat dépendent de l’opération de l’arithmomètre :<br><br>' 
 + '<table border="1" style="width:95%"><tr><th>Opération</th><th>Opérande 1</th><th>Opérande 2</th><th>Résultat</th></tr><tr><td>Addition</td><td>pose (curseurs)</td><td>totalisateur</td><td>totalisateur</td></tr>' 
 + '<tr><td>Soustraction</td><td>totalisateur</td><td>pose</td><td>totalisateur</td></tr><tr><td>Multiplication</td><td>pose</td><td>compteurs</td><td>totalisateur</td></tr>' 
 + '<tr><td>Division</td><td>totalisateur</td><td>pose</td><td>compteurs</td></tr></tr></table><br><br>' 
 + 'Par exemple pour calculer le volume d’un parallélépipède :<br><i>volume = largeur </i>&#215<i> longueur </i>&#215<i> hauteur</i>,<br>il faut effectuer deux multiplications et un transfert :<br>' 
 + '<i>largeur => pose (curseurs)<br>longueur => compteurs (manivelle)<br>totalisateur => pose (recopie à la main)<br>hauteur => compteurs (manivelle)</i><br><br>' 
 + 'Vers 1920, l’ingénieur Franz Trinks, de la firme Brunsviga, a ajouté le <b>transfert automatique</b> du totalisateur vers les curseurs à des machines de type Odhner, permettant d’enchaîner des multiplications .' ;

helpPage[1][10]  = '<h1><center>Transfers</h1><br>' 
 + 'Transfers are not strictly speaking arithmetic operations. They are sometimes necessary because the displays of the operands and the result depend on the operation of the arithmometer :<br><br>' 
 + '<table border="1" style="width:95%"><tr><th>Operation</th><th>Operand 1</th><th>Operande 2</th><th>Result</th></tr><tr><td>Addition</td><td>accumulator</td><td>ask (sliders)</td><td>accumulator</td></tr>' 
 + '<tr><td>Subtraction</td><td>accumulator</td><td>ask</td><td>accumulator</td></tr><tr><td>Multiplication</td><td>ask</td><td>counters</td><td>accumulator</td></tr>' 
 + '<tr><td>Division</td><td>accumulator</td><td>ask</td><td>counters</td></tr></tr></table><br><br>' 
 + 'For example, to calculate the volume of a parallelepiped :<br><i>volume = width </i>&#215<i> length </i>&#215<i> height</i>,<br>you have to make two multiplications and one transfer :<br>' 
 + '<i>width => ask (sliders)<br>length => counters (crank)<br>accumulator => ask (copy by hand)<br>height => counters (crank)</i><br><br>' 
 + 'Around 1920, the engineer Franz Trinks, from the Brunsviga firm, fitted the <b>automatic transfer</b> of the accumulator to the sliders to Odhner type machines, allowing to chain <b>multiplications.</b>' ;

helpPage[0][11]  = '<h1><center>Calculette</h1><br>' 
 + 'Beaucoup de mathématiciens fameux se sont plaint de la longueur et la pénibilité des calculs numériques avant le 20<sup>ème</sup> siècle. L’arithmomètre fut un progrès surtout parce qu’il évitait les ' 
 + 'erreurs de calcul. Mais sa capacité était limitée, il était lent, bruyant, dépourvu de virgule (ni fixe ni a fortiori flottante). ' 
 + 'De nos jours les calculettes 4 opérations sont partout : dans les smartphones, les tablettes, les ordinateurs, etc..<br> ' 
 + 'Pour ouvrir une calculette commandant l’arithmomètre, cliquez le bouton ci-dessous.<br>Tapez une expression suivie du signe "=" et observez l’arithmomètre effectuant le calcul de cette expression, qui peut être long.<br>' 
 + 'Les nombres sont limités à 6 chiffres.<br>Cliquer encore le signe "=" recalcule la même expression.<br>Si la calculette est ouverte, on peut également taper une expression avec les touches du clavier de l’ordinateur (0 à 9 et + &#8211; * / =).<br>' 
 + 'L’algorithme de division est celui dit "avec restauration".<br><br>' 
 + '<button id="Bouton" onclick="window.opener.popupCalculette()"><i>Calculette</i></button>' ;

helpPage[1][11]  = '<h1><center>Pocket calculator</h1><br>' 
 + 'Many famous mathematicians complained about the length and difficulty of the numerical calculations before the 20<sup>th</sup> century. The arithmometer was a significant advance mainly because ' 
 + 'it avoided calculation errors. But his capacity was limited, it was slow, noisy, lacked a decimal poinr (neither fixed nor floating). ' 
 + 'Nowadays 4-operation calculators are everywhere: in smartphones, tablets, computers, etc...<br>' 
 + 'To open a calculator that controls the arithmometer in a new window, click the button below.<br>Type an expression followed by the "=" sign and observe the arithmometer calculating this expression, which may take sometime. <br>' 
 + 'The numbers are limited to 6 digits.<br>Clicking the "=" sign again recalculates the same expression.<br>If the calculator window is open, you can also type an expression with the numeric keypad on the computer: keys(0 to 9 and + - * / =).<br>' 
 + 'The division algorithm is the one called "with restoration".<br><br>' 
 + '<button id="Bouton" onclick="window.opener.popupCalculette()"><i>Calculator</i></button>' ;

helpPage[0][12]  = '<h1><center>Extraction de racine carrée</h1><br>' 
 + 'La somme des n premiers nombres impaires successifs est le carré de n. On peut donc penser soustraire du radicande, tant qu’il reste positif, les nombres impairs successifs et les compter.<br>' 
 + 'Mais cela risque d’être long. On peut essayer avec la somme des n (nombre_impair * 100), égal au carré de 10n, des n (nombre_impair * 10000), égal au carré de 100n, etc…<br>' 
 + 'On va donc essayer les sommes des nombres impairs affectés de poids décroissants (... 1000000, 10000, 100, 1), en s’assurant que leur somme totale reste toujours un carré inférieur ou égal au radicande.<br>' 
 + 'Avec cette méthode, chaque n est un chiffre décimal.<br>' 
 + 'Algorithme du professeur Auguste Toepler pour l’arithmomètre de Thomas (vers 1860).<br>' 
 + 'On multiplie les 10 nombres impairs successifs par 5 :<br>' 
 + '01 03 05 07 09 11 13 15 17 19<br>05 15 25 35 45 55 65 75 85 95 (énumération beaucoup plus simple)<br>On multiplie aussi le radicande par 5 dans le totalisateur.<br>' 
 + '<b>Si</b> le totalisateur est positif ou nul <b>alors</b> {Soustraire, pousser le curseur courant vers le haut}<br>' 
 + '<b>Si</b> le totalisateur est négatif <b>alors</b> {Additionner pour restaurer, décaler le chariot à gauche, le curseur courant passe au curseur suivant à droite, initialiser le curseur courant à 0 et le curseur suivant à 5 (ce qui revient à échanger 5 et 0) }.<br>' 
 + 'On boucle <b>tant que</b> le chariot n’est pas totalement à gauche.<br>La racine sera dans "compteurs" et le reste dans "Totalisateur"<br><br>' 
 + 'Pour essayer cliquez : <button id="Bouton" onclick="window.opener.popupExtraction()"><i>Racine carr&eacute;e</i></button><br><br>'
 + 'En 1952, l\'ingénieur Grant Clawson Ellerbeck a conçu la "FRIDEN SRW", seule calculatrice électromécanique ayant l\'extraction automatique de racine carrée.' ;

helpPage[1][12]  = '<h1><center>Square root extraction</h1><br>' 
 + 'The sum of the first n sequential odd numbers is the square of n. We can therefore think of subtracting from the radicand, as long as it remains positive, the successive odd numbers and counting them.<br>' 
 + 'But this may be long. We can try with the sum of n (odd_numbers * 100), equal to the square of 10n, n (odd_numbers * 10000), equal to the square of 100n, etc ...<br>' 
 + 'We will therefore try the sums of the odd numbers assigned decreasing weights (... 1000000, 10000, 100, 1), making sure that their total sum always remains a square inferior or equal to the radicand.<br>' 
 + 'With this method, each n is a decimal digit.<br><br>' 
 + 'Algorithm of Professor Auguste Toepler for the Thomas arithmometer (circa 1860).<br>' 
 + 'We multiply the 10 successive odd numbers by 5:<br>' 
 + '01 03 05 07 09 11 13 15 17 19<br>05 15 25 35 45 55 65 75 85 95 (much simpler to list)<br>We also multiply the radicand by 5 in the accumulator.<br>' 
 + '<b>If</b> the accumulator is positive or zero <b>then</b> {Subtract, push the current slider up}<br>' 
 + '<b>If</b> the accumulator is negative <b>then</b> {Add to restore, shift the carriage to the left, the current slider moves to the next slider on the right, initialize the current slider to 0 and the next slider to 5 (which is equivalent to exchanging 5 and 0)}.<br>' 
 + 'The algorithm loops <b>while</b> the carriage is not totally on the left.<br>The root will be in "counters" and the remainder in "accumulator"<br><br>' 
 + 'To try click : <button id="Bouton" onclick="window.opener.popupExtraction()"><i>Square root</i></button><br><br>' 
 + 'In 1952, engineer Grant Clawson Ellerbeck designed the "FRIDEN SRW", the only electromechanical calculator featuring automatic square root extraction.';

helpPage[0][13]  = '<h1><center>Multiplication "à la volée"</h1><br>' 
 + 'La multiplication a été automatisée bien après la division.<br>En effet la multiplication "à la volée" était assez satisfaisante.<br>' 
 + 'Elle consiste à effectuer la multiplication au fur et à mesure de la pose du multiplieur sur un clavier séparé.<br>' 
 + 'Les calculatrices électromécaniques rapides terminent la multiplication "à la volée" presque en même temps que la pose du dernier chiffre du multiplieur.<br>' 
 + 'La plupart de ces machines exigent la pose du multiplieur "poids faible en tête" c’est à dire en commençant par le chiffre de l’unité.<br>' 
 + 'Ici on pose multiplicande et multiplieur comme on les écrit, en commençant par les poids forts.<br>L’arithmomètre est lent donc la multiplication "à la volée" demande de poser le multiplieur lentement.<br>' 
 + 'Pour essayer cliquez : <button id="Bouton" onclick="window.opener.popupOnthefly()"><i>&#192; la volée</i></button><br>' 
 + 'Le produit de la multiplication est dans le totalisateur, mais pas cadré à droite' ;

 helpPage[1][13]  = '<h1><center>Multiplication "on the fly"</h1><br>' 
 + 'Multiplication was automated well after division.<br>Indeed multiplication "on the fly" was quite satisfactory.<br>' 
 + 'It consists in carrying out a multiplication as the multiplier is typed digit after digit on a separate keyboard. <br>' 
 + 'The fast electromechanical calculators complete the multiplication "on the fly" almost at the same time as the last digit of the multiplier is typed.<br>' 
 + 'Most of these machines require the multiplier to be entered "least significant digit first" ie starting with the ones digit.<br>' 
 + 'Here we apply multiplicand and multiplier as we write, starting with the strongest weights.<br>The arithmometer is slow so the multiplier must be typed in slowly for multiplication "on the fly”.<br>' 
 + '<br>To try clic : <button id="Bouton" onclick="window.opener.popupOnthefly()"><i>on the fly</i></button><br><br>' 
 + 'The product of the multiplication is in the accumulator, but not right aligned' ;

helpPage[0][14]  = '<h1><center>Expressions remarquables</h1><br>' 
 + 'Le résultat du calcul de ces expressions est remarquable :<br>1 &times; 9 + 2 = 11<br>12 &times; 9 + 3 = 111<br>123 &times; 9 + 4 = 1111<br>1234 &times; 9 + 5 = 11111<br>12345 &times; 9 + 6 = 111111<br>123456 &times; 9 + 7 = 1111111<br>' 
 + '1234567 &times; 9 + 8 = 11111111<br>12345678 &times; 9 + 9 = 111111111<br>123456789 &times; 9 +10= 1111111111<br>En multipliant par 9 on soustrait deux chiffres voisins, car 9 = 10 &#8211; 1.<br><br>' 
 + '9 &times; 9 + 7 = 88<br>98 &times; 9 + 6 = 888<br>987 &times; 9 + 5 = 8888<br>9876 &times; 9 + 4 = 88888<br>98765 &times; 9 + 3 = 888888<br>987654 &times; 9 + 2 = 8888888<br>9876543 &times; 9 + 1 = 88888888<br>98765432 &times; 9 + 0 = 888888888<br><br>' 
 + '1 &times; 1 = 1<br>11 &times; 11 = 121<br>111 &times; 111 = 12321<br>1111 &times; 1111 = 1234321<br>11111 &times; 11111 = 123454321<br>111111 &times; 111111 = 12345654321<br>1111111 &times; 1111111 = 1234567654321<br>' 
 + '11111111 &times; 11111111 = 123456787654321<br>111111111 &times; 111111111=123456789 87654321<br><br>' 
 + '1 &times; 8 + 1 = 9<br>12 &times; 8 + 2 = 98<br>123 &times; 8 + 3 = 987<br>1234 &times; 8 + 4 = 9876<br>12345 &times; 8 + 5 = 98765<br>123456 &times; 8 + 6 = 987654<br>1234567 &times; 8 + 7 = 9876543<br>12345678 &times; 8 + 8 = 98765432<br>123456789 &times; 8 + 9 = 987654321' 
 + '<br>La multiplication par 8 se ramène à la multiplication par 9 suivie d\'une soustraction car 8 = 9 &#8211; 1. Puis on utilise 123456789 + 987654321 =  1111111110  car on ajoute des chiffres dont la somme est toujours 10.' ;

 helpPage[1][14]  = '<h1><center>Remarkable expressions</h1><br>' 
 + 'The following expressions give a remarkable result :<br>1 &times; 9 + 2 = 11<br>12 &times; 9 + 3 = 111<br>123 &times; 9 + 4 = 1111<br>1234 &times; 9 + 5 = 11111<br>12345 &times; 9 + 6 = 111111<br>123456 &times; 9 + 7 = 1111111<br>' 
 + '1234567 &times; 9 + 8 = 11111111<br>12345678 &times; 9 + 9 = 111111111<br>123456789 &times; 9 +10= 1111111111<br>Muliplying by 9 subtracts each pair of neighboring digits since 9 = 10 &#8211; 1.<br><br>' 
 + '9 &times; 9 + 7 = 88<br>98 &times; 9 + 6 = 888<br>987 &times; 9 + 5 = 8888<br>9876 &times; 9 + 4 = 88888<br>98765 &times; 9 + 3 = 888888<br>987654 &times; 9 + 2 = 8888888<br>9876543 &times; 9 + 1 = 88888888<br>98765432 &times; 9 + 0 = 888888888<br><br>' 
 + '1 &times; 1 = 1<br>11 &times; 11 = 121<br>111 &times; 111 = 12321<br>1111 &times; 1111 = 1234321<br>11111 &times; 11111 = 123454321<br>111111 &times; 111111 = 12345654321<br>1111111 &times; 1111111 = 1234567654321<br>' 
 + '11111111 &times; 11111111 = 123456787654321<br>111111111 &times; 111111111=123456789 87654321<br><br>' 
 + '1 &times; 8 + 1 = 9<br>12 &times; 8 + 2 = 98<br>123 &times; 8 + 3 = 987<br>1234 &times; 8 + 4 = 9876<br>12345 &times; 8 + 5 = 98765<br>123456 &times; 8 + 6 = 987654<br>1234567 &times; 8 + 7 = 9876543<br>12345678 &times; 8 + 8 = 98765432<br>123456789 &times; 8 + 9 = 987654321' 
 + '<br>Multiplication by 8 is equivalent to the multiplication by 9 followed by a subtraction since 8 = 9 &#8211; 1. Then we use 123456789 + 987654321 =  1111111110  since we add digits whith a sum always equal to 10.' ;

helpPage[0][15]  = '<h1><center>Calculer avec 12 chiffres</h1><br>' 
 + 'Les 6 curseurs de l’arithmomètre peuvent suffire pour les poser des calculs financiers. Il existait d’ailleurs des arithmomètre à 7 ou 8 curseurs (et même un "Piano" à 15 curseurs).<br>' 
 + 'Cependant six chiffres ne sont pas suffisant pour des calculs scientifiques de précision.<br>La "machine différentielle" que Charles Babbage consruisit de 1822 à 1842 travaille sur 20 chiffres, elle est exposée au London Science Museum<br><br>'
 + 'Commençons par l’addition de nombres de 12 chiffres :<br>Soient A = A<sub>1</sub>&times;10<sup>6</sup> + A<sub>2</sub> et B = B<sub>1</sub>&times;10<sup>6</sup> + B<sub>2</sub> .<br>' 
 + 'A<sub>1</sub> , A<sub>2</sub> , B<sub>1</sub> et B<sub>2</sub> sont des nombres de 6 chiffres.<br>' 
 + 'Alors A + B = (A<sub>1</sub> + B<sub>1</sub>)&times;10<sup>6</sup> + A<sub>2</sub> + B<sub>2</sub> .<br>' 
 + 'Naturellement il faut tenir compte de la retenue de A<sub>2</sub> + B<sub>2</sub> .<br><br>Passons à la multiplication de nombres de 12 chiffres :<br>' 
 + 'A &times; B = (A<sub>1</sub> &times; B<sub>1</sub>)&times;10<sup>12</sup><br>' 
 + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; + (A<sub>1</sub> &times; B<sub>2</sub> + A<sub>2</sub> &times; B<sub>1</sub>)&times;10<sup>6</sup><br>' 
 + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; + A<sub>2</sub> &times; B<sub>2</sub>.<br>'
 + 'Soit 4 multiplications et 4 additions, sur 6 chiffres. En effet les produits partiels sont sur 12 chiffres.<br>' 
 + 'L\'algorithme de Anatolii Karatsuba (1960) ne demande que 3 multiplications sur 6 chiffres :<br>U = A<sub>1</sub> &times; B<sub>1</sub> , V = A<sub>2</sub> &times; B<sub>2</sub> et W = (A<sub>1</sub> - A<sub>2</sub>) &times; (B<sub>2</sub> - B<sub>1</sub>) .<br> '
 + 'Alors A &times; B = U&times;10<sup>12</sup> + ( U + V + W )&times;10<sup>6</sup> + V .' ;

helpPage[1][15]  = '<h1><center>Calculate with 12 digits </h1><br>' 
 + 'The 6 sliders of the arithmometer are enough to make financial calculations. There were also arithmometers with 7 or 8 sliders (and even a 15-slider "Piano").<br>' 
 + 'However six digits are not enough for scientific precision calculations.<br>The "difference engine" that Charles Babbage constructed from 1822 to 1842 operate on 20-digit numbers. It is on display in the London Science Museum<br><br>'
 + 'Let\'s start with the addition of 12-digit numbers:<br>let A = A<sub>1</sub>&times;10<sup>6</sup> + A<sub>2</sub> and B = B<sub>1</sub>&times;10<sup>6</sup> + B<sub>2</sub> .<br>' 
 + 'A<sub>1</sub> , A<sub>2</sub> , B<sub>1</sub> and B<sub>2</sub> are 6-digit numbers.<br>' 
 + 'Then A + B = (A<sub>1</sub> + B<sub>1</sub>)&times;10<sup>6</sup> + A<sub>2</sub> + B<sub>2</sub> .<br>' 
 + 'Naturally we must take into account the carry of A<sub>2</sub> + B<sub>2</sub> .<br><br>Let\'s move on to the multiplication of 12-digit numbers :<br>' 
 + 'A &times; B = (A<sub>1</sub> &times; B<sub>1</sub>)&times;10<sup>12</sup><br>' 
 + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; + (A<sub>1</sub> &times; B<sub>2</sub> + A<sub>2</sub> &times; B<sub>1</sub>)&times;10<sup>6</sup><br>' 
 + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; + A<sub>2</sub> &times; B<sub>2</sub>.<br>'
 + 'That is 4 multiplications and 4 additions, on 6 digits. Indeed the partial products are on 12 digits.<br>'
 + 'Anatolii Karatsuba\'s algorithm (1960) requires only 3 multiplications on 6 digits :<br>U = A<sub>1</sub> &times; B<sub>1</sub> , V = A<sub>2</sub> &times; B<sub>2</sub> and W = (A<sub>1</sub> - A<sub>2</sub>) &times; (B<sub>2</sub> - B<sub>1</sub>) .<br> '
 + 'Then A &times; B = U&times;10<sup>12</sup> + ( U + V + W )&times;10<sup>6</sup> + V .' ;

helpPage[0][16]  = '<h1><center>Effaceur</h1><br>' 
 + '<br><img src="images/Pageenconstruction.gif">' ;

helpPage[1][16]  = '<h1><center>Reset</h1><br>' 
 + '<br><img src="images/Pageenconstruction.gif">' ;

helpPage[0][17]  = '<h1><center>Cylindre de Leibniz</h1><br>' 
 + 'Un cylindre cannelé de Leibniz est un cylindre muni de 9 dents de longueurs décroissantes. Avec ses très nombreuses variantes, il fut utilisé pendant trois siècles dans des machines à calculer.<br>' 
 + 'L’allemand Gottfried Wilhelm Leibniz, reconnu comme le plus grand intellectuel de son temps, l’inventa en 1671, mais c’est Thomas de Colmar qui le rendit célèbre avec son arithmomètre.<br>' 
 + '<br><center><img src="images/Cylindre_de_Leibniz_animé.gif"><br><i>Cylindre de Leibniz. Source Wikipedia</i></center>' 
 + 'L’engrenage rouge est positionnée de manière à n’être entraîné que par les dents 1, 2 et 3 du "cylindre de Leibniz".<br>' 
 + '<center><img src="images/Cylindre_de_Leibniz.gif"></center><br>Sur le Cylindre de Leibniz de l\'arithmomètre, un dispositif à "croix de malte" améliore la stabilité.';

 helpPage[1][17]  = '<h1><center>Leibniz drum</h1><br>' 
 + 'A Leibniz stepped drum is a cylinder fitted with 9 cogs of decreasing lengths. With its many variants, it was used for three centuries in calculating machines.<br>' 
 + 'The German mathematician Gottfried Wilhelm Leibniz, recognized as the greatest intellectual of his time, invented it in 1671, but Thomas de Colmar made it famous with his arithmometer.<br>' 
 + '<br><center><img src="images/Cylindre_de_Leibniz_animé.gif"><br><i>Leibniz drum. Source Wikipedia</i></center>' 
 + 'The red gear is positioned such that it is driven only by the cogs 1, 2 and 3 of the "Leibniz drum".'
 + '<center><img src="images/Cylindre_de_Leibniz.gif"></center><br>On the Leibniz drum of the arithmometer, a "Maltese cross" device improves stability.';

helpPage[0][18]  = '<h1><center>Croix de Malte</h1><br>'
 + 'Le cylindre de Leibniz est un engrenage à entrainement intermittent.<br>'
 + 'La croix de Malte est un dispositif mécanique destiné à bloquer la rotation d\'un engrenage quand il n\'est pas entraîné.<br>'
 + 'Dans l\'arithmomètre, il bloque la rotation inertielle des roues du totalisateur.<br>'
 + '<br><center><img src="images/CroixDeMalte.gif"><br><i>Croix de Malte (rouge) bloquée par la demi-lune verte<br>Source Wikipedia</i></center><br>' 
 + 'La croix de malte de l\'Arithmomètre, tounant avec les roues du totalisateur, peut bloquer ces dernières en 10 positions angulaires discrètes.'
 + ' La demi-lune, solidaire du cylindre de Leibniz, bloque là où ce dernier n\'a pas de dent pour entraîner.<br><br><center><img src="images/CroixDeMalte-2.gif"></center>';

helpPage[1][18]  = '<h1><center>Maltese cross</h1><br>'
 + 'The Leibniz drum is a gear with intermittent drive.<br>' 
 + 'The Geneva drive or Maltese cross is a gear mechanism designed to block the rotation of a gear when it is not driven.<br>'
 + 'This device stops the inertial rotation of the wheels of the arithmometer accumulator.<br>'
 + '<br><center><img src="images/CroixDeMalte.gif"><br><i>Maltese cross (red) blocked by the half-moon (green)<br>Source Wikipedia</i></center><br>' 
 + 'The Maltese cross of the Arithmometer, turning with the wheels of the totalizer, can lock the later in 10 discrete angular positions.' 
 + 'The half-moon, secured to the Leibniz drum, locks wherever the latter has no cog tooth.<br><br><center><img src="images/CroixDeMalte-2.gif"></center>';
 
helpPage[0][19]  = '<h1><center>Navette de retenue</h1><br>' 
 + '<br><img src="images/Pageenconstruction.gif"> ' ;

helpPage[1][19]  = '<h1><center>Carry shuttle</h1><br>' 
 + '<br><img src="images/Pageenconstruction.gif"> ' ;

helpPage[0][20]  = '<h1><center>Auteurs et maintenance</h1><br>' 
 + 'Cet arithmomètre 3D a été créée dans le cadre d’un projet universitaire par les étudiants de troisième année de licence mathématique et informatique de l’année 2015-2016 : <br>' 
 + 'BARBIER Clémence, DEMBELE Mama, DIDES Julien, GERSPACHER Thomas, GIRARD Julien, LE QUELLENEC Gwendal, LEE Noah, MOIRANT Corentin et SAPET Mathilde, sur une idée de GINDRE René, secrétaire d’ACONIT<br><br>' 
 + 'Cet arithmomètre est maintenu par <A HREF="mailto:alain.guyot\'arobase\'aconit.org">GUYOT Alain</A>, vos remarques sont bienvenues. Replacer \'arobase\' par @ dans l’adresse du mail'  
 + '' ;
helpPage[1][20]  = '<h1><center>Auteurs et maintenance</h1><br>' 
 + 'This 3D arithmometer was created as part of a university project by the third year students of mathematics and computer science for the year 2015-2016 : <br>' 
 + 'BARBIER Clémence, DEMBELE Mama, DIDES Julien, GERSPACHER Thomas, GIRARD Julien, LE QUELLENEC Gwendal, LEE Noah, MOIRANT Corentin et SAPET Mathilde, after an idea of GINDRE René, ACONIT secretary<br><br>' 
 + 'The simulator is maintained by <A HREF="mailto:alain.guyot\'arobase\'aconit.org">GUYOT Alain</A>, yous remarks are wecome. Replace \'arobase\' by @ in the mail address' ;  
 + '' ;




