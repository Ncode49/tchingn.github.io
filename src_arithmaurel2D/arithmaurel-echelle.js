var debugWindow;

function popupDebug() {
    if (debugWindow == null || debugWindow.closed) debugWindow = window.open('debug.html', 'debug', 'menubar=no,status=no,scrollbars=no,resizable=yes,toolbar=no, width=290, height=500');
    debugWindow.focus();
}

var canvas1 = document.getElementById("calque1");
var canvas2 = document.getElementById("calque2");
var canvas3 = document.getElementById("calque3");
canvas3.width = canvas2.width = canvas1.width = window.innerWidth;
canvas3.height = canvas2.height = canvas1.height = window.innerHeight * 0.75;
var ctxDisk = canvas1.getContext('2d');
var ctxCadr = canvas2.getContext('2d');
var ctxBout = canvas3.getContext('2d');
var arithmaurel = new Image();
var masque1 = new Image();
var masque2 = new Image();
var affichage = new Array(8);
var srcLoaded = 0,
    rayonX, rayonY, offsetX, offsetY;
var resultat = [0, 0, 0, 0, 0, 0, 0, 0, 5]; // résultat affiché
var resulExact = [0, 0, 0, 0, 0, 0, 0, 0]; // résultat exact, retenue propagée
var inputTiret = [1, 0, 0, 0, 0, 0, 0, 0]; // entrée tirettes
var inputCadr = [0, 0, 0, 0]; // entrée cadrans
var angleInit = new Array(8);
var angleUnit = -36 * Math.PI / 180; // dixieme de tour
var diskAxeX = [423, 399, 367, 328, 292, 254, 223, 199]; // axe des disques
var diskAxeY = [295, 261, 238, 224, 224, 238, 261, 295]; // d'affichage
var fleches = new Array(4);
var flechAxeX = [179 - 9 - 39, 287 - 9 - 37, 420 - 11 - 37, 529 - 9 - 39]; // axe des flÃ¨ches
var flechAxeY = [411 - 45, 480 - 49, 480 - 49, 410 - 46]; // de pose
var cadrnAxeX = [179, 287, 420, 529]; // axe des cadrans
var cadrnAxeY = [411, 480, 480, 410]; // de pose
var flechAngl = [0, 0, 0, 0]; // angle des flÃ¨ches
var captureOK = false;
var oldMouseX, oldMouseY, oldAngl, sensRot;
var curAngl, curCadr, curTiret, baseCadr, temp;
var echelle = 1;
var posCadreH = 67,
    posCadreB = 187,
    posCadreD = 154,
    posCadreG = 547; // was 175 526
affichage[0] = new Image();
affichage[0].src = 'images/affichage.png'; // roues d'affichage
affichage[0].onload = function() {
    for (var i = 7; i > 0; i--) { affichage[i] = affichage[0].cloneNode(true); }
    rayonX = Math.round(affichage[0].width / 2);
    rayonY = Math.round(affichage[0].height / 2);
    srcLoaded++;
    if (srcLoaded == 5) complete();
};
fleches[0] = new Image();
fleches[0].src = 'images/fleche.png'; // fleche des cadrans
fleches[0].onload = function() {
    for (var i = 3; i > 0; i--) { fleches[i] = fleches[0].cloneNode(true); }
    offsetX = Math.round(fleches[0].width / 2);
    offsetY = Math.round(fleches[0].height / 2);
    srcLoaded++;
    if (srcLoaded == 5) complete();
};
arithmaurel.src = 'images/arithmaurel.png';
arithmaurel.onload = function() {
    srcLoaded++;
    if (srcLoaded == 5) complete();
};
masque1.src = 'images/masque1.png';
masque1.onload = function() {
    srcLoaded++;
    if (srcLoaded == 5) complete();
};
masque2.src = 'images/masque2.png';
masque2.onload = function() {
    srcLoaded++;
    if (srcLoaded == 5) complete();
};

//	window.addEventListener('click', function (e) {console.log(e.x, e.y);} ); // pour reperer sur le dessin
window.addEventListener('mousemove', function(e) { captureMove(e.x, e.y); }); // appel des que la souris bouge
window.addEventListener('mousedown', function(e) { captureStart(e.x, e.y, e.which); });
window.addEventListener('mouseup', function(e) { captureStop(e.x, e.y); });
window.addEventListener('resize', onWindowResize, false);

for (var i = 0; i < 8; i++) { angleInit[i] = -i * 120 / 7 * Math.PI / 180 };

function complete() { // chargement termine
    textExemples = document.getElementById('textExemples');
    onWindowResize();
    choiLang(0);
}

function onWindowResize() {
    echelle = window.innerHeight / 960;
    canvas3.height = canvas2.height = canvas1.height = window.innerHeight * 0.75;
    ctxDisk.clearRect(0, 0, canvas1.width, canvas1.height);
    ctxDisk.setTransform(echelle, 0, 0, echelle, 0, 0);
    ctxDisk.fillStyle = "black";
    ctxDisk.fillRect(199 - 46, 224 - 46, 423 + 46, 224 + 46);
    ctxCadr.clearRect(0, 0, canvas2.width, canvas2.height);
    ctxCadr.setTransform(echelle, 0, 0, echelle, 0, 0);
    ctxBout.clearRect(0, 0, canvas3.width, canvas3.height);
    ctxBout.setTransform(echelle, 0, 0, echelle, 0, 0);
    ctxCadr.drawImage(arithmaurel, 50, 47);
    ctxBout.drawImage(masque1, 321, 260);
    ctxBout.drawImage(masque2, 122, 440);
    tourneDisk();
    for (var i = 0; i < 4; i++) { tourneFlech(i) };
}

function tourneDisk() {
    for (var i = 0; i < 8; i++) {
        ctxDisk.translate(diskAxeX[i] + rayonX, diskAxeY[i] + rayonY);
        ctxDisk.rotate(angleInit[i] + angleUnit * resultat[i]);
        ctxDisk.drawImage(affichage[i], -rayonX, -rayonY);
        ctxDisk.setTransform(echelle, 0, 0, echelle, 0, 0);
    }
}

function tourneFlech(i) {
    ctxCadr.translate(flechAxeX[i] + offsetX, flechAxeY[i] + offsetY);
    ctxCadr.rotate(flechAngl[i]);
    ctxCadr.drawImage(fleches[i], -offsetX, -offsetY);
    ctxCadr.setTransform(echelle, 0, 0, echelle, 0, 0);
}

function captureStart(x, y, which) { // which = 1 bouton gauche;  2 bouton droit 
    // on selection cle de remise a zero pas d'animation ici
    if ((x > echelle * 320) && (x < echelle * 370) && (y > echelle * 260) && (y < echelle * 390)) {
        console.log("1");
        RAZdisk(5)
    };
    captureOK = true;
    curCadr = curTiret = -1;
    // on selectionne un cadran
    for (var i = 0; i < 4; i++) {
        if (((x - echelle * cadrnAxeX[i]) * (x - echelle * cadrnAxeX[i]) + (y - echelle * cadrnAxeY[i]) * (y - echelle * cadrnAxeY[i])) <= echelle * 50 * echelle * 50) {
            curCadr = i
            console.log("cadran selectionne")
        }
    }

    // on est sur une fleche
    if (curCadr >= 0) { // got cadrans
        document.body.style.cursor = 'ew-resize';
        // baseCadr stocke la retenu
        baseCadr = inputCadr[3 - curCadr];
        //console.log("Ok")
        //console.log(baseCadr)
        // si on bouge et que l'on est dans la partie droite du cadran
        if (x > echelle * cadrnAxeX[curCadr]) {
            oldAngl = Math.atan((y - echelle * cadrnAxeY[curCadr]) / (x - echelle * cadrnAxeX[curCadr]));

            console.log("angle")
            console.log(oldAngl * 180 / Math.PI)
        } // si on bouge et que l'on est dans la partie gauche du cadran
        else {
            oldAngl = Math.PI - Math.atan(-(y - echelle * cadrnAxeY[curCadr]) / (x - echelle * cadrnAxeX[curCadr]));
            console.log("angle2")
            console.log(oldAngl * 180 / Math.PI)
        }
    }
    if (y > echelle * posCadreH && y < echelle * posCadreB && x > echelle * posCadreD && x < echelle * posCadreG) { //got tirettes
        // changement du curseur
        console.log("partie3")
        document.body.style.cursor = 'ns-resize';
        temp = (echelle * posCadreG - echelle * posCadreD) / 7;
        for (var i = 0; i < 8; i++) {
            // on selectionne une tirette et on donne son dumero
            if (x > echelle * posCadreD - (temp / 2) + (temp * i)) {
                curTiret = 7 - i
            }
        };
    }
    if (curTiret >= 0) {
        oldMouseY = y
    };
    if (curTiret + curCadr > -2) {
        document.getElementById('textExemples').innerHTML = '.';
    }
}

function captureStop(x, y) {
    if (curCadr >= 0) {
        // on met a jour le cadrans selectionne
        inputCadr[3 - curCadr] = Math.round(inputCadr[3 - curCadr]);
        flechAngl[curCadr] = inputCadr[3 - curCadr] * angleUnit * (11 / 20);
        simulation(0);
        tourneDisk();
        tourneFlech(curCadr);
        affichCadran();
    }
    if (curTiret >= 0) {
        affichTiret(0);
    }
    document.body.style.cursor = 'auto';
    captureOK = false;
    curCadr = curTiret = -1;
}

function captureMove(x, y) {
    // x et y position de la souris
    if (captureOK) {
        if (curCadr >= 0) {
            // partie de droite angle va de -90 a 90
            if (x > echelle * cadrnAxeX[curCadr]) {
                // met a jour l'angle de l'aiguille
                curAngl = Math.atan((y - echelle * cadrnAxeY[curCadr]) / (x - echelle * cadrnAxeX[curCadr]));
                console.log("debut")
                console.log(cadrnAxeY[curCadr])
                console.log(x)

                console.log(cadrnAxeX[curCadr])
                console.log(y)
                console.log("fin")

                console.log(curAngl * 180 / Math.PI)
            } // on évite le zéro	
            // partie de gauche		   
            if (x < echelle * cadrnAxeX[curCadr]) {
                curAngl = Math.PI - Math.atan(-(y - echelle * cadrnAxeY[curCadr]) / (x - echelle * cadrnAxeX[curCadr]));
            }

            if (Math.abs(oldAngl - curAngl) >= (-angleUnit / 50)) // discrétisation
            {
                if ((oldAngl + (Math.PI / 2)) * (curAngl + (Math.PI / 2)) < 0) // 
                {
                    inputCadr[3 - curCadr] = 9;
                    tourneFlech(curCadr);
                    captureOK = false;
                } else {
                    flechAngl[curCadr] = curAngl + (Math.PI / 2); // correct
                    temp = flechAngl[curCadr] / angleUnit / (11 / 20); // t
                    if (temp <= -9.01) { temp += 18 }; // correction
                    inputCadr[3 - curCadr] = temp;
                    oldAngl = curAngl;
                    simulation(1);
                    tourneDisk();
                    tourneFlech(curCadr);
                    affichCadran();
                }
            }
        }
        if (curTiret >= 0) {
            if (Math.abs(y - oldMouseY) > 4) {
                inputTiret[curTiret] = Math.min(9, Math.max(0, inputTiret[curTiret] + Math.round((y - oldMouseY) / 4)));
                oldMouseY = y;
                affichTiret(1);
            }
        }
    }
}

function affichTiret(mode) {
    document.getElementById('tirette').innerHTML = '&nbsp;';
    for (var i = 7; i >= 0; i--) {
        document.getElementById('tirette').innerHTML += inputTiret[i] + '&nbsp;'
    }
}

function affichCadran() {
    document.getElementById('cadran').innerHTML = '&nbsp;';
    for (var i = 3; i >= 0; i--) {
        document.getElementById('cadran').innerHTML += (Number.isInteger(inputCadr[i]) ? inputCadr[i] : inputCadr[i].toFixed(2)) + '&nbsp;'
    }
}