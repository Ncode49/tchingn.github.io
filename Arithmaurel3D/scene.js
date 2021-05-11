import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { ColladaLoader } from './lib/ColladaLoader.js';

var camera, controls, scene, renderer;
const mouse = new THREE.Vector2();
var BruitBouton = new Audio('sounds/Calculateur_mecanique.mp3');
BruitBouton.preload = 'auto';
BruitBouton.loop = false;
var ecrouCentre;
var childrens = [];
// stocke les états
var aiguilles = [];
var fantAiguilles = new Array(4); // fantomes aiguilles
var seuil = Math.PI / 50; // valeur arbitraire
var pente = 2.9 * (Math.PI / 9) / (1 - (2 * seuil) / (Math.PI / 9)); // pente de (seuil, 0) à (PI/9 - seuil, PI/9)
// le 2.9 est pragmatique et non scientifique. Je ne sais pas d'où il vient.
var cadrans = new Array(8); // cadrans d'affichage des résultats
var angleInitCadrans = new Array(8); // angle initial du cadran qui affiche 0
var resultat = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // valeur numérique des cadrans et retenue sortante
var ecrouLaitons = [];
var tirettes = [];
var val_Tirettes = [];
var multiplicande = 0; // valeur des tirettes
var produit = 0; //  produit de la multiplication
var last_Tirette = -1;
// stocke les objets mobiles
var objectMove = [];
// boleen pour l'etat de la souris qui est soit enfoncée ou non
var down = 0;
var animeReturnZ;
const planeDessus = new THREE.Plane(new THREE.Vector3(0, 1, 0), -3.92);
const planeFace = new THREE.Plane(new THREE.Vector3(1, 0, 0), -8);

// variable qui stocke intersection de la souris avec le plan
var intersection = new THREE.Vector3();


var evenement = null;
var raycaster = new THREE.Raycaster();

// letiable pour stocker les evenements pour RAZ
var nbanimationsRZ = 80;
var nbanimationsRZaig = 90;
var animeReturnZero;
var animvueChangeProg;


// positionnement pour changement de vue
var dPosX, dPosY, dPosZ, dUpX, dUpY, dUpZ, pasChange;
var pasChange;
var intersection = new THREE.Vector3();
// variable pour le changement d'état affiché
var inputCadr = [0, 0, 0, 0]; // entrée cadrans


// variable positionnnement des aiguilles et ecrous
var oldAngleEcrou, newAngleEcrou;
var oldChiffreMult, newChiffreMult;
var oldAngleCentre, newAnglecentre;
var etat = 0;
init();
animate();

// event listener
renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
BruitBouton.addEventListener('ended', function(e) { BruitBouton.currentTime = 0.2 }, false);

// Boutons
const RAZaiguilles = document.getElementById("RAZaiguilles");
const RAZtotaliseur = document.getElementById("RAZtotaliseur");
const face = document.getElementById("face");
const dessus = document.getElementById("dessus");
RAZaiguilles.addEventListener("click", razAiguilles);
RAZtotaliseur.addEventListener("click", razTotaliseur);
face.addEventListener("click", faceVue)
dessus.addEventListener("click", faceDessus)





function init() {

    // Scene
    scene = new THREE.Scene();
    // Rendu sur la page
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(25, 10, 0);

    // Controles
    controls = new OrbitControls(camera, renderer.domElement);
    //controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    // controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 30;


    // helper The X axis is red. The Y axis is green. The Z axis is blue.
    // const axesHelper = new THREE.AxesHelper(10);
    // scene.add(axesHelper);
    // const helper = new THREE.PlaneHelper(planeFace, 20, 0xffff00);
    // scene.add(helper);

    // instantiate a loader
    var loader = new ColladaLoader();
    // instancie l'arithmaurel et l'affiche a l'écran
    loader.load('modeles_3D/arithmaurel.dae',

        // Function when resource is loaded

        function(collada) {

            // affichage de la scene
            childrens = collada.scene.children;
            scene.add(collada.scene);
            //console.log(collada.scene.children)
            // recuperations des elements
            stockeObject();
        },

        // Function called when download progresses
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }
    );
    // charger et positionner les autres éléments en dupliquant le code précédent

    // Lumiere
    let light = new THREE.DirectionalLight(0xffffff, 0.2);
    light.position.set(1, 1, 0);
    scene.add(light);
    var lightAmb = new THREE.AmbientLight(0xffffff)
    scene.add(lightAmb)

    window.addEventListener('resize', onWindowResize, false);
}



/**
 * fonction qui initialise les objets mobiles
 * objectMove contient la liste des objets mobiles et interactifs (utilse pour detecter quand la souris clique sur un de ces elements)
 * on initialise en meme temps les etats des objets en mémoire
 */

function stockeObject() {
    console.log(childrens)
    ecrouCentre = childrens[24];
    ecrouCentre.rotation.x += Math.PI / 5
    console.log(ecrouCentre.rotation.x * 180 / Math.PI)
    objectMove.push(ecrouCentre.children[0])
    objectMove.push(ecrouCentre.children[1])
    objectMove.push(ecrouCentre.children[2])

    for (let i = 0; i <= 7; i++) {
        cadrans[i] = childrens[i];
        angleInitCadrans[i] = cadrans[i].rotation.x; // angle initial
    }
    //console.log(cadrans)

    for (let i = 12; i <= 19; i++) {
        tirettes.push(childrens[i])
        objectMove.push(childrens[i].children[12])
        objectMove.push(childrens[i].children[10])
        val_Tirettes.push(0)

    }
    //console.log(tirettes)
    for (let i = 8; i <= 11; i++) {
        aiguilles.push(childrens[i])
    }
    aiguilles.reverse();
    initAiguilles(); // remise à zéro aiguilles et fantome
    //console.log(aiguilles)
    for (let i = 20; i <= 23; i++) {
        childrens[i].rotation.x = 0
        ecrouLaitons.push(childrens[i])
        objectMove.push(childrens[i].children[0])

    }
    ecrouLaitons.reverse()
        //console.log(ecrouLaitons)

    //   console.log("object")
    // console.log(objectMove)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    //event.preventDefault()
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
        //event.preventDefault()
    BruitBouton.pause()
    BruitBouton.currentTime = 0
    evenement = null;
    down = 0;
    document.body.style.cursor = 'auto';
    //discretisationTirette();


    controls.enabled = true;
}

/**
 *  fonction de traitement de l'evenement lorsque le click est enfoncée
 * @param {*} event
 */
function onDocumentMouseDown(event) {
    //event.preventDefault()
    down = 1;
    //   console.log("down")
    // recupere position de la souris quand on bouge
    //  MoldX = (event.clientX / window.innerWidth) * 2 - 1;
    // MoldY = -(event.clientY / window.innerHeight) * 2 + 1;
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
                    //               console.log("angle " + oldAngleEcrou * 180 / Math.PI)
                    //  console.log("down: " + oldAngleEcrou * 180 / Math.PI)
                    // oldAngleAiguille = aiguilles[evenement[5] - 1].rotation.x
                document.body.style.cursor = 'ew-resize';
                break;
            case 'T':
                document.body.style.cursor = 'ns-resize';
                break;
        }



        //  console.log(evenement)
    }

    // on stoppe le control pour la position de l'arithmmaurel
    // controls.enabled = false;
}

/**
 * Fonction qui déclenche l'animation de remise a zero de l'écrou au centre
 */
function animeRazTot() {
    nbanimationsRZ--;
    animeReturnZero = requestAnimationFrame(animeRazTot);
    if (nbanimationsRZ >= 40) {
        for (let i = 0; i < 8; i++) {
            cadrans[i].rotation.x -= Math.PI / 10;
            if (cadrans[i].rotation.x < angleInitCadrans[i]) {
                cadrans[i].rotation.x = angleInitCadrans[i];
            }
        }
        ecrouCentre.rotation.x -= Math.PI / 100;
    } else {
        ecrouCentre.rotation.x += Math.PI / 100;
    }
    // objectParent.parent.rotation.x -= Math.PI/50;

    renderer.render(scene, camera);

    if (nbanimationsRZ == 0) {
        console.log("fini")
        nbanimationsRZ = 80;
        BruitBouton.pause()
        BruitBouton.currentTime = 0
        window.cancelAnimationFrame(animeReturnZero);

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

}

var ecrouCentrecoord = []
ecrouCentrecoord.push(0.18312431445661992)
ecrouCentrecoord.push(-0.18312431445662275)

function animeCentre() {
    let pas;
    raycaster.setFromCamera(mouse, camera);
    // calcul intersection souris plan => intersection
    raycaster.ray.intersectPlane(planeFace, intersection);
    console.log("zintersection" + intersection.z)
    console.log("yintersection" + intersection.y)
    console.log(intersection.y)
    if (intersection.y > ecrouCentrecoord[0])
        newAnglecentre = +Math.atan((intersection.z - ecrouCentrecoord[1]) / (intersection.y - ecrouCentrecoord[0])) - Math.PI / 2



    //console.log(etat)
    //console.log("nouvel angle " + newAngleEcrou * 180 / Math.PI)

    pas = newAnglecentre - oldAngleCentre;

    // l'angle de la premiere frame est fausse, on l'enleve
    if (etat == 1) {
        cadransNormal()
        pas = 0;
        etat = 0
    }
    // cadrans remise a zero
    if (pas < 0) {
        for (let i = 0; i < 8; i++) {
            cadrans[i].rotation.x += pas * Math.PI * 1.2;
            if (cadrans[i].rotation.x < angleInitCadrans[i]) {
                cadrans[i].rotation.x = angleInitCadrans[i];
            }
        }
    }
    ecrouCentre.rotation.x += pas
    console.log("valeur ecrou" + ecrouCentre.rotation.x * 180 / Math.PI)
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
    // console.log(intersection)
    // coordonnees de l'intersection pour le premier cadran
    // va de 0 a 360 degre dans le sens antihoraire pas encore bon en réglage
    // mettre 2 if
    if (intersection.z <= coord[numero][1]) {
        newAngleEcrou = -Math.atan((intersection.y - coord[numero][0]) / (intersection.z - coord[numero][1])) + 3 * Math.PI / 2
    } else {
        newAngleEcrou = -Math.atan((intersection.y - coord[numero][0]) / (intersection.z - coord[numero][1])) + Math.PI / 2
    }
    //newAngleEcrou += Math.PI

    //console.log(etat)
    //console.log("nouvel angle " + newAngleEcrou * 180 / Math.PI)
    pas = newAngleEcrou - oldAngleEcrou;
    if (etat == 1) {
        pas = 0
        etat = 0;
    }

    ecrou.rotation.x += pas;
    // if (Math.abs(pas) > 0.1 ) { BruitBouton.play()} ;


    console.log("pas = " + pas);

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
    affichCadran(); // valeurs numériques des cadrans

    oldAngleEcrou = newAngleEcrou;
}

/**
 *  fonction de calcul spacial à l'arithmaurel, code adapté de arithmaurel 2D
 *  entrées = numéro de l'aiguille qui bouge, incrément de cette aiguille
 */
function calcResult(numero, increment) {
    produit += multiplicande * increment * Math.pow(10, numero);
    console.log('numero = ' + numero + ' increment = ' + increment + ' produit = ' + produit.toFixed(4));

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
 * Remet à la position initile les aiguilles
 */
function initAiguilles() {
    console.log("ok")
    for (let i = 0; i < aiguilles.length; i++) {
        aiguilles[i].rotation.x = Math.PI / 2;
        fantAiguilles[i] = Math.PI / 2;
        inputCadr[i] = 0;
    }
    console.log("valeur rotation ", aiguilles[0].rotation.x)
    affichCadran();
}

function razAiguilles() {
    aiguillesNormal()
    console.log(aiguilles[0].rotation.x)
    animeRazAig();
    for (let i = 0; i < 4; i++) {
        fantAiguilles[i] = Math.PI / 2;
        inputCadr[i] = 0;
    }
    affichCadran();

}

function razTotaliseur() {
    produit = 0;
    cadransNormal()
    BruitBouton.play()
    animeRazTot();
    console.log('RAZ produit');
}


function discretisationTirette() {
    if (last_Tirette > -1) {
        let tirette = tirettes[last_Tirette]
        if (tirette.position.x < 6.20) {
            tirette.position.x = 6.081
            val_Tirettes[last_Tirette] = 0
        } else if (tirette.position.x > 6.20 && tirette.position.x < 6.488) { // 6,488-6,20=0,288
            tirette.position.x = 6.479
            val_Tirettes[last_Tirette] = 0
        } else if (tirette.position.x >= 6.488 && tirette.position.x < 6.73) { // 6,73-6,488 = 0.242
            tirette.position.x = 6.72
            val_Tirettes[last_Tirette] = 1
        } else if (tirette.position.x >= 6.73 && tirette.position.x < 7.052) { // 7,052-6,73 = 0.322
            tirette.position.x = 7
            val_Tirettes[last_Tirette] = 2
        } else if (tirette.position.x >= 7.052 && tirette.position.x < 7.25) { // 7,25-7,052 = 0.198
            tirette.position.x = 7.247
            val_Tirettes[last_Tirette] = 3
        } else if (tirette.position.x >= 7.25 && tirette.position.x < 7.5) { // 7.5-7.25 = 0.25
            tirette.position.x = 7.498
            val_Tirettes[last_Tirette] = 4
        } else if (tirette.position.x >= 7.5 && tirette.position.x < 7.75) { // 7.75-7.5 = 0.25
            tirette.position.x = 7.741
            val_Tirettes[last_Tirette] = 5
        } else if (tirette.position.x >= 7.75 && tirette.position.x < 8) { // 8-7.75 = 0.25
            tirette.position.x = 7.991
            val_Tirettes[last_Tirette] = 6
        } else if (tirette.position.x >= 8 && tirette.position.x < 8.32) { // 8.32-8 = 0.32
            tirette.position.x = 8.296
            val_Tirettes[last_Tirette] = 7
        } else if (tirette.position.x >= 8.32 && tirette.position.x < 8.6) { //8.6-8.32 = 0.28
            tirette.position.x = 8.537
            val_Tirettes[last_Tirette] = 8
        } else if (tirette.position.x >= 8.6 && tirette.position.x < 8.8) { // 8.8-8.6 = 0.2
            tirette.position.x = 8.799
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

function affichCadran() {
    document.getElementById('cadran').innerHTML = '&nbsp;';
    for (let i = 3; i >= 0; i--) {
        document.getElementById('cadran').innerHTML += (Number.isInteger(inputCadr[i]) ? inputCadr[i] : inputCadr[i].toFixed(2)) + '&nbsp;'
    }
}

function vueChange(posX, posY, posZ, upX, upY, upZ) {
    // console.log (camera.rotation.x, camera.rotation.y, camera.rotation.z )
    pasChange = 16;
    // verifier ici que la distance n'est pas trop importante
    dPosX = (camera.position.x - posX) / pasChange;
    dPosY = (camera.position.y - posY) / pasChange;
    dPosZ = (camera.position.z - posZ) / pasChange;
    dUpX = (camera.up.x - upX) / pasChange;
    dUpY = (camera.up.y - upY) / pasChange;
    dUpZ = (camera.up.z - upZ) / pasChange;
    vueChangeProg();
}

function vueChangeProg() {
    animvueChangeProg = requestAnimationFrame(vueChangeProg);
    if (pasChange > 0) {
        camera.position.x -= dPosX;
        camera.position.y -= dPosY;
        camera.position.z -= dPosZ; // rotation
        camera.up.x -= dUpX;
        camera.up.y -= dUpY;
        camera.up.z -= dUpZ; // uniquement pivotement de la camÃ©ra
        pasChange--;
    } else {
        //controls = new THREE.TrackballControls(camera);
        camera.lookAt(scene.position);
        window.cancelAnimationFrame(animvueChangeProg);
    }
}
// 3 premier arguments posX, posY, posZ
function faceVue() {
    vueChange(20, 0, 0, 0, 1, 0)
}

function faceDessus() {
    vueChange(15, 14, 0, 0, 1, 0)
}

/**
 * faire passer les valeurs entre offset et offset + 2*Math.PI pour l'animation
 */
function cadransNormal() {
    for (let i = 0; i < 8; i++) {
        // met les valeurs entre offset et offset + 2*Math.PI
        if (cadrans[i].rotation.x > angleInitCadrans[i] + Math.PI * 2) {
            while (cadrans[i].rotation.x > angleInitCadrans + Math.PI * 2) {
                cadrans[i].rotation.x -= 2 * Math.PI
            }
        }
        if (cadrans[i].rotation.x < angleInitCadrans[i]) {
            while (cadrans[i].rotation.x < angleInitCadrans) {
                cadrans[i].rotation.x += 2 * Math.PI
            }
        }
        resultat[i] = 0
    }
}
/**
 * faire passer les valeurs entre offset et offset + 2*Math.PI pour l'animation
 */
function aiguillesNormal() {
    for (let i = 0; i < 4; i++) {
        console.log(aiguilles[i].rotation.x)
            // met les valeurs entre offset et offset + 2*Math.PI
        if (aiguilles[i].rotation.x > Math.PI / 2 + Math.PI * 2) {
            while (aiguilles[i].rotation.x > Math.PI / 2 + Math.PI * 2) {
                aiguilles[i].rotation.x -= 2 * Math.PI
            }
        }
        if (aiguilles[i].rotation.x < Math.PI / 2) {
            console.log("inf")
            while (aiguilles[i].rotation.x < Math.PI / 2) {
                aiguilles[i].rotation.x += 2 * Math.PI
            }
        }
    }

}

/**
 * change de 90 a 0 tout les 10 frames
 */
function animeRazAig() {
    nbanimationsRZaig--;
    // console.log(nbanimationsRZaig)
    animeReturnZ = requestAnimationFrame(animeRazAig)
    if (nbanimationsRZaig % 5 == 0) {
        for (let i = 0; i <= 3; i++) {
            console.log(aiguilles[i].rotation.x)
            if (aiguilles[i].rotation.x < Math.PI / 2) {
                aiguilles[i].rotation.x = Math.PI / 2
            }
            if (aiguilles[i].rotation.x > Math.PI / 2 + Math.PI / 9) {
                aiguilles[i].rotation.x -= Math.PI / 9;
            } else {
                aiguilles[i].rotation.x = Math.PI / 2
            }
        }

    }

    renderer.render(scene, camera);
    console.log(nbanimationsRZ)
    if (nbanimationsRZaig == 0) {
        nbanimationsRZaig = 90;
        console.log("fini")
        window.cancelAnimationFrame(animeReturnZ);
    }
}