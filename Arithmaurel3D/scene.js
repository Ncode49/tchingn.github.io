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


var evenement = null;
var raycaster = new THREE.Raycaster();

// letiable pour stocker les evenements pour RAZ
var nbanimationsRZ = 80;
var animeReturnZero;

// variable pour des coordonnées de la souris pour les tirettes et l'écrou
var MoldX;
var MoldY;

// variable pour le changement d'état affiché
var inputTiret = [0, 0, 0, 0, 0, 0, 0, 0]; // entrée tirettes
var inputCadr = [0, 0, 0, 0]; // entrée cadrans
init();
animate();

// event listener
renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);

const RAZaiguilles = document.getElementById("RAZaiguilles");
RAZaiguilles.addEventListener("click", razAiguilles);


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
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(20, 20, 0);

    // Controles
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 30;

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
            console.log(collada.scene.children)
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
        ecrouLaitons.push(childrens[i])
        objectMove.push(childrens[i].children[0])

    }
    ecrouLaitons.reverse()
        //console.log(ecrouLaitons)

    console.log("object")
    console.log(objectMove)
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
    event.preventDefault()
        // recupere position de la souris quand on bouge
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

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
    event.preventDefault()
    evenement = null;
    down = 0;
    document.body.style.cursor = 'auto';
    if (last_Tirette > -1) {
        let tirette = tirettes[last_Tirette]
        if (tirette.position.x > 6.20 && tirette.position.x < 6.488) {
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
    }
    controls.enabled = true;
}

/**
 *  fonction de traitement de l'evenement lorsque le click est enfoncée
 * @param {*} event 
 */
function onDocumentMouseDown(event) {
    event.preventDefault()
    down = 1;

    console.log("down")
        // recupere position de la souris quand on bouge
    MoldX = (event.clientX / window.innerWidth) * 2 - 1;
    MoldY = -(event.clientY / window.innerHeight) * 2 + 1;
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
                console.log(intersects[0].object)
                animeRAZ();
                break;
            case 'E':
                document.body.style.cursor = 'ew-resize';
                break;
            case 'T':
                document.body.style.cursor = 'ns-resize';
                break;
        }



        console.log(evenement)
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

    // plante si on sort de l'ecran
    let numero = evenement[7] - 1
    let tirette = tirettes[numero]
        // console.log(mouse.y)
        //console.log(MoldY - mouse.y)
        //console.log(tirettes[numero])
        // trouver le max et le min pour replacer curseur
    if (tirette.position.x < 8.8 && tirette.position.x > 6.08) {
        tirette.position.x += (MoldY - mouse.y) / 1.5
        if (tirette.position.x > 8.8) {
            tirette.position.x = 8.79999
        }
        if (tirette.position.x < 6.08) {
            tirette.position.x = 6.081
        }
    }
    console.log(tirette.position.x)
    last_Tirette = numero


}



/**
 *  fonction d'animation de l'écrou si on translate vers la droite => rotation sens horaire
 * si translate souris vers la gauche => rotation sens anti-horaire
 */
function animeEcrou() {
    document.body.style.cursor = 'ew-resize';
    let numero = evenement[5] - 1
    let ecrou = ecrouLaitons[numero]
    let aiguille = aiguilles[numero]
    let rotationTranslate = MoldX - mouse.x;
    ecrou.rotation.x += rotationTranslate
    aiguille.rotation.x += rotationTranslate
}

/** 
 * Remet à la position initile les aiguilles
 */
function razAiguilles() {
    for (let i = 0; i < aiguilles.length; i++) {
        ecrouLaitons[i].rotation.x = -3.137;
        aiguilles[i].rotation.x = 1.585;
    }
}