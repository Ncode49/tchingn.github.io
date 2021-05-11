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
var cadrans = new Array(8); // cadrans d'affichage des résultats
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
            //console.log(collada.scene.children)
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
    console.log(objectMove)
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
}

export { camera, controls, scene, renderer, objectMove, tirettes, ecrouCentre, cadrans, aiguilles, ecrouLaitons, angleInitCadrans, fantAiguilles, val_Tirettes, inputCadr, init }