import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { ColladaLoader } from './lib/ColladaLoader.js';

var camera, controls, scene, renderer;
const mouse = new THREE.Vector2();

var ecrouCentre;
var childrens = [];
// stocke les états
var aiguilles = [];
var cadrans = [];
var ecrouLaitons = [];
var tirettes = [];
var val_Tirettes = [];
var last_Tirette = -1;
// stocke les objets mobiles
var objectMove = [];
// boleen pour l'etat de la souris qui est soit enfoncée ou non
var down = 0;

const planeDessus = new THREE.Plane(new THREE.Vector3(0, 1, 0), -3.92);
const planeFace = new THREE.Plane(new THREE.Vector3(1, 0, 0), -8);

// variable qui stocke intersection de la souris avec le plan
var intersection = new THREE.Vector3();


var evenement = null;
var raycaster = new THREE.Raycaster();

// letiable pour stocker les evenements pour RAZ
var nbanimationsRZ = 80;
var animeReturnZero;
var animvueChangeProg;


// positionnement pour changement de vue
var dPosX, dPosY, dPosZ, dUpX, dUpY, dUpZ, dRotX, dRotY, dRotZ, pasChange;
var pasChange;
var intersection = new THREE.Vector3();
// variable pour le changement d'état affiché
var inputTiret = [0, 0, 0, 0, 0, 0, 0, 0]; // entrée tirettes
var inputCadr = [0, 0, 0, 0]; // entrée cadrans

// variable positionnnement des aiguilles et ecrous
var oldAngleEcrou, newAngleEcrou;
var etat = 0;
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
RAZtotaliseur.addEventListener("click", razTotaliseur);
face.addEventListener("click", faceVue)
dessus.addEventListener("click", faceDessus)





function init() {

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xD9EFFF);
    //scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

    // Rendu sur la page
    renderer = new THREE.WebGLRenderer({ antialias: true });
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


    // helper
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
    const helper = new THREE.PlaneHelper(planeFace, 20, 0xffff00);
    // scene.add(helper);

    // instantiate a loader 
    var loader = new ColladaLoader();
    // instancie l'arithmaurel et l'affiche a l'écran
    loader.load('modeles_3D/arithmaurel.dae',

        // Function when resource is loaded

        function(collada) {

            for (let i = 0; i < collada.scene.children.length; i++) { childrens.push(collada.scene.children[i]); }
            // affichage de la scene
            childrens = collada.scene.children;
            scene.add(collada.scene);
            //console.log(collada.scene.children)
            // recuperations des elements
            stockeObject()
                //   scene.add(collada.scene.children[2]);

        },
        // Function called when download progresses
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }
    );
    // charger et positionner les autres éléments en dupliquant le code précédent

    // Lumiere
    /*
    let light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    let light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( - 1, - 1, - 1 );
    scene.add( light );

    let light = new THREE.AmbientLight( 0x222222 );
    scene.add( light );
    */
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
    ecrouCentre = childrens[24];
    ecrouCentre.rotation.x += Math.PI / 5
    objectMove.push(ecrouCentre.children[0])
    objectMove.push(ecrouCentre.children[1])
    objectMove.push(ecrouCentre.children[2])

    for (let i = 0; i <= 7; i++) {
        cadrans.push(childrens[i])
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
    aiguilles.reverse()
        //console.log(aiguilles)
    for (let i = 20; i <= 23; i++) {
        childrens[i].rotation.x = 0
        ecrouLaitons.push(childrens[i])
        objectMove.push(childrens[i].children[0])

    }
    ecrouLaitons.reverse()
        //console.log(ecrouLaitons)

    console.log("object")
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
        if (intersects.length > 0) {
            document.body.style.cursor = 'grab';
        } else {
            document.body.style.cursor = 'default';
        }
    }

    //   console.log(mouse)
    // si la touche est enfonce et que evenement ne correspond pas a la remise a zero
    // si on veut ajouter d'autres evenement par simple click, ajouter une condition supplémentaire
    if (down && evenement != null && evenement[0] != 'R') {

        switch (evenement[0]) {
            // l'ecrou bouge
            case 'E':
                animeEcrou()
                break;
                // la tirette bouge
            case 'T':

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

    console.log("down")
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
        switch (evenement[0]) {
            case 'R':
                console.log("cle de remise a zero")
                    // console.log(intersects[0].object)
                animeRAZ();
                break;
            case 'E':
                let numero = evenement[5] - 1
                oldAngleEcrou = ecrouLaitons[numero].rotation.x
                console.log("angle " + oldAngleEcrou * 180 / Math.PI)
                etat = 1;
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
function animeRAZ() {
    nbanimationsRZ--;
    animeReturnZero = requestAnimationFrame(animeRAZ);
    if (nbanimationsRZ >= 40) {
        ecrouCentre.rotation.x -= Math.PI / 100;
    } else {
        ecrouCentre.rotation.x += Math.PI / 100;
    }
    // objectParent.parent.rotation.x -= Math.PI/50;

    renderer.render(scene, camera);

    if (nbanimationsRZ == 0) {
        console.log("fini")
        nbanimationsRZ = 80;
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



// coordonnees centre 
// 1 :  y= -2, z = -3
// 2 :  y = -3.23, z = -1.2
// 3 :  y = - 3.31 z = 1
// 4 :  y = -2, z = -2.79
/** 
 *  fonction d'animation de l'écrou si on translate vers la droite => rotation sens horaire
 * si translate souris vers la gauche => rotation sens anti-horaire
 */
const coord = []
coord.push([-2, -3])
coord.push([-3.23, -1.2])
coord.push([-3.31, 1])
coord.push([-2, 2.79])

function animeEcrou() {

    document.body.style.cursor = 'ew-resize';
    let numero = evenement[5] - 1
    let ecrou = ecrouLaitons[numero]
    let aiguille = aiguilles[numero]
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
    if (etat) {
        if (intersection.y <= coord[numero][0] /*&& (oldAngleEcrou >= 0 && oldAngleEcrou < Math.PI / 4)*/ ) {
            console.log("souris dessous")
            console.log(oldAngleEcrou)
            if ((oldAngleEcrou >= 0 && oldAngleEcrou <= Math.PI / 2) || (oldAngleEcrou <= 2 * Math.PI && oldAngleEcrou >= 3 * Math.PI / 2)) {
                console.log("angle dessus")
                ecrou.rotation.x -= Math.PI
                aiguille.rotation.x -= Math.PI
                    //console.log(oldAngleEcrou * 180 / Math.PI)

                //aiguille.rotation.x += Math.PI
            } else {

            }

            //  ecrou.rotation.x += Math.PI
        }
        if (intersection.y > coord[numero][0] /*&& (oldAngleEcrou >= 0 && oldAngleEcrou < Math.PI / 4)*/ ) {

            console.log("souris dessus")
            console.log(oldAngleEcrou * 180 / Math.PI)
            if (oldAngleEcrou > Math.PI / 2 && oldAngleEcrou < 3 * Math.PI / 2) {
                ecrou.rotation.x -= Math.PI
                aiguille.rotation.x -= Math.PI


            }
            // ecrou.rotation.x += Math.PI
        }
    }
    etat = 0;
    //newAngleEcrou += Math.PI


    //console.log(etat)
    //console.log("nouvel angle " + newAngleEcrou * 180 / Math.PI)
    pas = newAngleEcrou - oldAngleEcrou;
    ecrou.rotation.x += newAngleEcrou - oldAngleEcrou


    if (ecrou.rotation.x < 0) {
        console.log("ok")
        ecrou.rotation.x += Math.PI * 2
    }
    if (ecrou.rotation.x > 2 * Math.PI) {
        ecrou.rotation.x -= Math.PI * 2
    }
    console.log(ecrou.rotation.x * 180 / Math.PI)
        /*
        if (newAngleEcrou  2 * Math.PI) {
            newAngleEcrou -= 2 / Math.PI
        }
        */
        //console.log("difference d angle " + pas * 180 / Math.PI)
        //console.log("angle aiguille " + aiguille.rotation.x * 180 / Math.PI)
    aiguille.rotation.x += newAngleEcrou - oldAngleEcrou
        // console.log("angle ecrou " + ecrou.rotation.x * 180 / Math.PI);
        // console.log("difference d angle " + pas * 180 / Math.PI)
        // console.log("angle aiguille " + aiguille.rotation.x * 180 / Math.PI)
    oldAngleEcrou = newAngleEcrou

}


/** 
 * Remet à la position initile les aiguilles
 */
function razAiguilles() {
    for (let i = 0; i < aiguilles.length; i++) {
        //ecrouLaitons[i].rotation.x = 0;
        aiguilles[i].rotation.x = +5 * Math.PI / 2;
    }
}

function razTotaliseur() {
    // TODO
}


function discretisationTirette() {
    if (last_Tirette > -1) {
        let tirette = tirettes[last_Tirette]
        if (tirette.position.x < 6.20) {
            tirette.position.x = 6.081
            val_Tirettes[last_Tirette] = 0
        } else if (tirette.position.x > 6.20 && tirette.position.x < 6.488) {
            tirette.position.x = 6.479
            val_Tirettes[last_Tirette] = 0
        } else if (tirette.position.x >= 6.488 && tirette.position.x < 6.73) {
            tirette.position.x = 6.72
            val_Tirettes[last_Tirette] = 1
        } else if (tirette.position.x >= 6.73 && tirette.position.x < 7.052) {
            tirette.position.x = 7
            val_Tirettes[last_Tirette] = 2
        } else if (tirette.position.x >= 7.052 && tirette.position.x < 7.25) {
            tirette.position.x = 7.247
            val_Tirettes[last_Tirette] = 3
        } else if (tirette.position.x >= 7.25 && tirette.position.x < 7.5) {
            tirette.position.x = 7.498
            val_Tirettes[last_Tirette] = 4
        } else if (tirette.position.x >= 7.5 && tirette.position.x < 7.75) {
            tirette.position.x = 7.741
            val_Tirettes[last_Tirette] = 5
        } else if (tirette.position.x >= 7.75 && tirette.position.x < 8) {
            tirette.position.x = 7.991
            val_Tirettes[last_Tirette] = 6
        } else if (tirette.position.x >= 8 && tirette.position.x < 8.32) {
            tirette.position.x = 8.296
            val_Tirettes[last_Tirette] = 7
        } else if (tirette.position.x >= 8.32 && tirette.position.x < 8.6) {
            tirette.position.x = 8.537
            val_Tirettes[last_Tirette] = 8
        } else if (tirette.position.x >= 8.6 && tirette.position.x < 8.8) {
            tirette.position.x = 8.799
            val_Tirettes[last_Tirette] = 9
        }
        last_Tirette = -1
        affichTirette()
    }
}

function affichTirette() {
    document.getElementById('tirette').innerHTML = '&nbsp;';
    for (let i = 7; i >= 0; i--) {
        document.getElementById('tirette').innerHTML += val_Tirettes[i] + '&nbsp;'
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

function Move2() {

    console.log("ok")
}