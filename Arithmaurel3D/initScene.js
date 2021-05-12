import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { ColladaLoader } from './lib/ColladaLoader.js';

var camera, controls, scene, renderer;

// liste des objets mobiles
var objectMove = [];
// liste avec l'ensemble des objets
var childrens = [];

// variable de l'ecrou au centre
var ecrouCentre;

// variable pour les cadrans (roues qui tournent)
var cadrans = []; // cadrans d'affichage des résultats
var angleInitCadrans = new Array(8); // angle initial du cadran qui affiche 0
var inputCadr = [0, 0, 0, 0]; // entrée cadrans

// variable pour les tirettes
var tirettes = [];
var val_Tirettes = [];

// variables pour les aiguilles
var aiguilles = [];
var fantAiguilles = new Array(4); // fantomes aiguilles

// variables pour les ecrous 
var ecrouLaitons = [];
var loader = new ColladaLoader();

function init() {
    initScene()
    initCollada()
}

function initScene() {
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

    // light
    let light = new THREE.DirectionalLight(0xffffff, 0.2);
    light.position.set(1, 1, 0);
    scene.add(light);
    let lightAmb = new THREE.AmbientLight(0xffffff)
    scene.add(lightAmb)

    // redimensionnement
    window.addEventListener('resize', onWindowResize, false);

}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function initCollada() {
    // instancie l'arithmaurel et l'affiche a l'écran
    loader.load('modeles_3D/arithmaurel.dae',

        // Function when resource is loaded

        function(collada) {

            // affichage de la scene
            childrens = collada.scene.children;
            scene.add(collada.scene);

            //scene.children[2].children[0].visible = false
            //  console.log(collada.scene.children)
            // recuperations des elements
            stockeObject();
        },

        // Function called when download progresses
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }
    );
}


/**
 * fonction qui initialise les objets mobiles
 * objectMove contient la liste des objets mobiles et interactifs (utilse pour detecter quand la souris clique sur un de ces elements)
 * on initialise en meme temps les etats des objets en mémoire
 */

function stockeObject() {

    initEcrouCentre()

    //console.log(cadrans)
    initTirettes()
    initAiguilles();
    initCadrans()
    initEcrouLaitons()
}


/**
 * Remet à la position initile les aiguilles
 */
function initAiguilles() {
    for (let i = 14; i <= 17; i++) {
        aiguilles.push(childrens[i])
    }
    // initialise valeur des aiguilles
    for (let i = 0; i < aiguilles.length; i++) {
        aiguilles[i].rotation.x = Math.PI / 2;
        fantAiguilles[i] = Math.PI / 2;
        inputCadr[i] = 0;
    }
    console.log("aiguilles")
    console.log(aiguilles)
}

function initEcrouCentre() {
    console.log(childrens)
    ecrouCentre = childrens[1];
    ecrouCentre.rotation.x += Math.PI / 5
    console.log(ecrouCentre.rotation.x * 180 / Math.PI)
    objectMove.push(ecrouCentre.children[0])
    objectMove.push(ecrouCentre.children[1])
    objectMove.push(ecrouCentre.children[2])
}

function initCadrans() {
    let j = 0;
    for (let i = 25; i >= 18; i--, j++) {
        cadrans.push(childrens[i]);
        console.log(j)
        let angleInit = (j - 3.5) * Math.PI / (3.6 * 3.5);
        cadrans[j].rotation.x += angleInit;
        cadrans[j].position.y += 0.70 * Math.sin(angleInit); // ajuster avec le rayon du cadran
        cadrans[j].position.z += 0.70 * (1 - Math.cos(angleInit))
        angleInitCadrans[j] = cadrans[j].rotation.x; // angle initial
        cadrans[j].position.x = 7.3; // tous au même niveau
    }
    console.log("cadrans")
    console.log(cadrans)

}

function initTirettes() {
    for (let i = 6; i <= 13; i++) {
        tirettes.push(childrens[i])
        objectMove.push(childrens[i].children[12])
        objectMove.push(childrens[i].children[10])
        val_Tirettes.push(0)

    }
    tirettes.reverse()
    console.log("valeur tirettes")
    console.log(tirettes)
}

function initEcrouLaitons() {
    for (let i = 2; i <= 5; i++) {
        childrens[i].rotation.x = 0
        ecrouLaitons.push(childrens[i])
        objectMove.push(childrens[i].children[0])
    }
    console.log("ecrou")
    console.log(ecrouLaitons)
        // ecrouLaitons.reverse()
}
export { camera, controls, scene, renderer, objectMove, tirettes, ecrouCentre, cadrans, aiguilles, ecrouLaitons, angleInitCadrans, fantAiguilles, val_Tirettes, inputCadr, init }