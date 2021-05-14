import * as THREE from './lib/three.module.js';
import { affichCadran } from './affichageBouton.js'
import { BruitBouton } from './sound.js'
import { camera, controls, tirettes, val_Tirettes, angleInitCadrans, scene, renderer, objectMove, ecrouCentre, cadrans, aiguilles, ecrouLaitons, fantAiguilles, inputCadr, init } from './initScene.js'
import { faceDessus, faceVue } from './vueChangement.js'
import { razAiguilles } from './animeAiguillesRaz.js'
import { razTotaliseur, cadransNormal, majPosCadran } from './animeTotaliseurRaz.js'


// stocke les états

const mouse = new THREE.Vector2();
var seuil = Math.PI / 50; // valeur arbitraire
var pente = 2.9 * (Math.PI / 9) / (1 - (2 * seuil) / (Math.PI / 9)); // pente de (seuil, 0) à (PI/9 - seuil, PI/9)
// le 2.9 est pragmatique et non scientifique. Je ne sais pas d'où il vient.

var resultat = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // valeur numérique des cadrans et retenue sortante


var multiplicande = 0; // valeur des tirettes
var produit = 0; //  produit de la multiplication
var last_Tirette = -1;

// boleen pour l'etat de la souris qui est soit enfoncée ou non
var down = 0;
const planeDessus = new THREE.Plane(new THREE.Vector3(0, 1, 0), -3.92);
const planeFace = new THREE.Plane(new THREE.Vector3(1, 0, 0), -8);

// variable qui stocke intersection de la souris avec le plan
var intersection = new THREE.Vector3();


var evenement = null;
var raycaster = new THREE.Raycaster();

// letiable pour stocker les evenements pour RAZ

var intersection = new THREE.Vector3();
// variable pour le changement d'état affiché


// variable positionnnement des aiguilles et ecrous
var oldAngleEcrou, newAngleEcrou;
var oldAngleCentre, newAnglecentre;
var etat = 0;
var raz;
init();
animate();

// event listener
renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);

// Boutons
const RAZaiguilles = document.getElementById("RAZaiguilles");
const RAZtotaliseur = document.getElementById("RAZtotaliseur");
const face = document.getElementById("face");
const dessus = document.getElementById("dessus");
RAZaiguilles.addEventListener("click", razAiguilles);
RAZtotaliseur.addEventListener("click", function() {
    razTotaliseur()
    produit = 0;
    for (let i = 0; i < 8; i++) {
        resultat[i] = 0
    }
});
face.addEventListener("click", faceVue)
dessus.addEventListener("click", faceDessus)

// Bouton Simulation
const addition = document.getElementById("bAddition");
const soustraction = document.getElementById("bSoustraction");
const multiplication = document.getElementById("bMultiplication");
const division = document.getElementById("bDivision");
const sigma = document.getElementById("bSigma")
addition.addEventListener("click", ok)
soustraction.addEventListener("click", ok)
multiplication.addEventListener("click", ok)
division.addEventListener("click", ok)
sigma.addEventListener("click", ok)

function ok() {
    console.log("ok")
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
}

/**
 * Lorsque la souris bouge, met a jour coordonnee de la souris
 * permet de faire bouger les elements si le click est enfoncée
 */

function onDocumentMouseMove(event) {
    // recupere position de la souris quand on bouge
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // si click non enfoncé, change le curseur si selectionne objet mobile
    if (!down) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objectMove);
        document.body.style.cursor = intersects.length > 0 ? 'grab' : 'default';
    }

    //   console.log(mouse)
    // si la touche est enfonce et que evenement ne correspond pas a la remise a zero
    // si on veut ajouter d'autres evenement par simple click, ajouter une condition supplémentaire
    if (down && evenement != null) {
        switch (evenement[0]) {
            case 'R': // la remise à zéro bouge
                animeCentre()

                for (let i = 0; i < 8; i++) {
                    resultat[i] = 0
                }
                break;
            case 'E': // l'ecrou bouge
                animeEcrou()
                break;
            case 'T': // la tirette bouge
                animeTirette()
                break;
        }
    }

}

/**
 * traite l'evenement up dans ce cas redonne le controle a l'utilisateur ou termine evenement lorsque l'on bouge les parties mobiles
 */
function onDocumentMouseUp(event) {
    discretisationTirette()
    razCentreRelache()

    //event.preventDefault()
    BruitBouton.pause()
    BruitBouton.currentTime = 0
    evenement = null;
    down = 0;
    document.body.style.cursor = 'auto';
    controls.enabled = true;
}

/**
 * fonction de traitement quand on enfonce le bouton de la souris
 */
function onDocumentMouseDown(event) {
    down = 1;
    raycaster.setFromCamera(mouse, camera);
    // stoppe le controle sur les deplacements pour pouvoir bouger l'objet

    // quand on appuie sur la souris, teste si on intercepte un objet mobile
    // puis on traite les différents cas en fonction de l'objet selectionné
    // ecrou laiton, ecrouCentre, tirette
    const intersects = raycaster.intersectObjects(objectMove);

    // detection d'un evenement
    if (intersects.length > 0) {
        //  console.log(intersects[0].object)

        controls.enabled = false;
        // nom de l'objet selectionnée
        evenement = intersects[0].object.parent.name;
        etat = 1;
        switch (evenement[0]) {
            case 'R':
                BruitBouton.play()

                console.log("cle de remise a zero")
                oldAngleCentre = ecrouCentre.rotation.x
                break;
            case 'E':
                let numero = evenement[5] - 1
                oldAngleEcrou = ecrouLaitons[numero].rotation.x
                document.body.style.cursor = 'ew-resize';
                break;
            case 'T':
                document.body.style.cursor = 'ns-resize';
                break;
        }
    }
}





var ecrouCentrecoord = []
ecrouCentrecoord.push(0.18312431445661992)
ecrouCentrecoord.push(-0.18312431445662275)

function animeCentre() {
    let pas;
    raycaster.setFromCamera(mouse, camera);
    // calcul intersection souris plan => intersection
    raycaster.ray.intersectPlane(planeFace, intersection);
    //console.log("zintersection" + intersection.z)
    //console.log("yintersection" + intersection.y)
    if (intersection.y > ecrouCentrecoord[0])
        newAnglecentre = +Math.atan((intersection.z - ecrouCentrecoord[1]) / (intersection.y - ecrouCentrecoord[0])) - Math.PI / 2

    pas = newAnglecentre - oldAngleCentre;

    // l'angle de la premiere frame est fausse, on l'enleve
    if (etat == 1) {
        cadransNormal()
        pas = 0;
        etat = 0
    }
    // cadrans remise a zero a la fin, revient a la position initiale
    // si on decale vers la droite va de 216 a 138

    if (pas < 0) {
        majPosCadran()
    }

    // va de 216 a 138 degres
    // pas negatidf donc tourne sens horaire gauche droite 9 -> 0
    //  console.log("valeur angle centre: " + ecrouCentre.rotation.x * 180 / Math.PI)
    ecrouCentre.rotation.x += pas
    oldAngleCentre = newAnglecentre
    if (ecrouCentre.rotation.x * 180 / Math.PI > 216) {
        ecrouCentre.rotation.x = 215.999999999 * Math.PI / 180
    }
    if (ecrouCentre.rotation.x * 180 / Math.PI < 138) {
        ecrouCentre.rotation.x = 138.0001 * Math.PI / 180
    }
}




// coordonnees centres écrous
// 1 :  y= -2, z = -3
// 2 :  y = -3.23, z = -1.2
// 3 :  y = - 3.31 z = 1
// 4 :  y = -2, z = -2.79
const coord = [
    [-2, -3],
    [-3.23, -1.2],
    [-3.31, 1],
    [-2, 2.79]
];

/**
 *  fonction d'animation de l'écrou : l'écrou suit
 *  le mouvement de rotation de la souris autour de l'axe
 */
function animeEcrou() {

    document.body.style.cursor = 'ew-resize';
    let numero = evenement[5] - 1
    let ecrou = ecrouLaitons[numero]
    let pas;
    // ne pas oublier cette ligne pour maj les coordonnees de la souris
    raycaster.setFromCamera(mouse, camera);
    // calcul intersection souris plan => intersection
    raycaster.ray.intersectPlane(planeFace, intersection);
    // mettre 2 if
    console.log("intersection")
    if (intersection.z <= coord[numero][1]) {
        newAngleEcrou = -Math.atan((intersection.y - coord[numero][0]) / (intersection.z - coord[numero][1])) + 3 * Math.PI / 2
    } else {
        newAngleEcrou = -Math.atan((intersection.y - coord[numero][0]) / (intersection.z - coord[numero][1])) + Math.PI / 2
    }
    pas = newAngleEcrou - oldAngleEcrou;
    if (etat == 1) {
        pas = 0
        etat = 0;
    }

    ecrou.rotation.x += pas;
    //console.log("pas = " + pas);

    if (pas > Math.PI) {
        pas -= Math.PI;
        fantAiguilles[numero] += (5 / 18) * Math.PI
    }
    if (pas < -Math.PI) {
        pas += Math.PI;
        fantAiguilles[numero] -= (5 / 18) * Math.PI
    }
    fantAiguilles[numero] -= (5 / 18) * pas;

    var oldInputCadr = inputCadr[numero];
    var roundAiguille = Math.PI / 2 + Math.round((fantAiguilles[numero] - Math.PI / 2) / (Math.PI / 9)) * (Math.PI / 9);
    var difference = fantAiguilles[numero] - roundAiguille;

    if (Math.abs(difference) <= seuil) { aiguilles[numero].rotation.x = roundAiguille } else {
        if (difference > 0) { aiguilles[numero].rotation.x = roundAiguille + (difference - seuil) * pente } else { aiguilles[numero].rotation.x = roundAiguille + (difference + seuil) * pente }
    }

    inputCadr[numero] = (aiguilles[numero].rotation.x - Math.PI / 2) / (Math.PI / 9);

    if (Math.abs(inputCadr[numero].toFixed(2)) % 1 < 0.001) { inputCadr[numero] = Math.round(inputCadr[numero]) }; // entier
    calcResult(numero, inputCadr[numero] - oldInputCadr);
    affichCadran(inputCadr); // valeurs numériques des cadrans

    oldAngleEcrou = newAngleEcrou;
}

/**
 *  fonction de calcul spacial à l'arithmaurel, code adapté de arithmaurel 2D
 *  entrées = numéro de l'aiguille qui bouge, incrément de cette aiguille
 */
function calcResult(numero, increment) {
    produit += multiplicande * increment * Math.pow(10, numero);
    //console.log('numero = ' + numero + ' increment = ' + increment + ' produit = ' + produit.toFixed(4));

    var retenue = 0; // pour le passage progressif de 9 à 0 ou de 0 à 9
    for (var i = numero; i < 8; i++) {
        resultat[i] += val_Tirettes[i - numero] * increment;
        while (resultat[i] >= 10) {
            resultat[i] -= 10;
            resultat[i + 1]++
        };
        while (resultat[i] < 0) {
            resultat[i] += 10;
            resultat[i + 1]--
        };
        if (retenue > 9) { retenue = (retenue - 9) + resultat[i] } else { retenue = resultat[i] };
        cadrans[i].rotation.x = angleInitCadrans[i] + retenue * Math.PI / 5;
    }
}



/**
 *  fonction d'animation de la tirette si on translate vers le haut => diminution valeur de la tirette
 * si translate souris vers le bas => augmentation de la valeur de la tirette
 */
function animeTirette() {
    document.body.style.cursor = 'ns-resize';
    // quand on appuis cela calcul
    // plante si on sort de l'ecran
    let numero = evenement[7] - 1
    let tirette = tirettes[numero]

    // ne pas oublier cette ligne pour maj les coordonnees de la souris
    raycaster.setFromCamera(mouse, camera);
    // calcul intersection souris plan => intersection
    raycaster.ray.intersectPlane(planeDessus, intersection);
    tirette.position.x = -1.95 + intersection.x

    // limite du systeme
    if (tirette.position.x < 6.08) {
        tirette.position.x = 6.081
    }
    if (tirette.position.x > 8.8) {
        tirette.position.x = 8.79999
    }
    last_Tirette = numero
    discretisationTiretteC()
}

function discretisationTiretteC() {
    let tirette = tirettes[last_Tirette]
    if (tirette.position.x >= 6.5) {
        val_Tirettes[last_Tirette] = (tirette.position.x - 6.5) * 3.92
        val_Tirettes[last_Tirette] = val_Tirettes[last_Tirette].toFixed(2)
    }
    affichTirette()
}

function discretisationTirette() {
    // difference de 0.1255
    if (last_Tirette > -1) {
        let tirette = tirettes[last_Tirette]
        if (tirette.position.x < 6.20) {
            tirette.position.x = 6.1
            val_Tirettes[last_Tirette] = 0
        } else if (tirette.position.x > 6.20 && tirette.position.x < 6.6275) {
            tirette.position.x = 6.5
            val_Tirettes[last_Tirette] = 0
        } else if (tirette.position.x >= 6.6275 && tirette.position.x < 6.8825) {
            tirette.position.x = 6.755
            val_Tirettes[last_Tirette] = 1
        } else if (tirette.position.x >= 6.8825 && tirette.position.x < 7.1375) {
            tirette.position.x = 7.01
            val_Tirettes[last_Tirette] = 2
        } else if (tirette.position.x >= 7.1375 && tirette.position.x < 7.3925) {
            tirette.position.x = 7.265
            val_Tirettes[last_Tirette] = 3
        } else if (tirette.position.x >= 7.3925 && tirette.position.x < (7.52 + 7.775) / 2) {
            tirette.position.x = 7.52
            val_Tirettes[last_Tirette] = 4
        } else if (tirette.position.x >= (7.52 + 7.775) / 2 && tirette.position.x < (7.775 + 8.03) / 2) {
            tirette.position.x = 7.775
            val_Tirettes[last_Tirette] = 5
        } else if (tirette.position.x >= (7.775 + 8.03) / 2 && tirette.position.x < (8.03 + 8.285) / 2) {
            tirette.position.x = 8.03
            val_Tirettes[last_Tirette] = 6
        } else if (tirette.position.x >= (8.03 + 8.285) / 2 && tirette.position.x < (8.54 + 8.285) / 2) {
            tirette.position.x = 8.285
            val_Tirettes[last_Tirette] = 7
        } else if (tirette.position.x >= (8.54 + 8.285) / 2 && tirette.position.x < (8.54 + 8.795) / 2) {
            tirette.position.x = 8.54
            val_Tirettes[last_Tirette] = 8
        } else if (tirette.position.x >= (8.795 + 8.54) / 2 && tirette.position.x < 8.8) {
            tirette.position.x = 8.795
            val_Tirettes[last_Tirette] = 9
        }
        last_Tirette = -1
        affichTirette()
    }
}

function affichTirette() {
    document.getElementById('tirette').innerHTML = '&nbsp;';
    multiplicande = 0;
    for (let i = 7; i >= 0; i--) {
        document.getElementById('tirette').innerHTML += val_Tirettes[i] + '&nbsp;'
        multiplicande = 10 * multiplicande + val_Tirettes[i];
    }
}

function razCentreRelache() {
    raz = setInterval(decrement, 100)
}

function decrement() {
    ecrouCentre.rotation.x += Math.PI / 50
    console.log(ecrouCentre.rotation.x * 180 / Math.PI)
    if (ecrouCentre.rotation.x * 180 / Math.PI > 216) {
        ecrouCentre.rotation.x = 216 * Math.PI / 180
        clearInterval(raz)

    }
}