import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { ColladaLoader } from './lib/ColladaLoader.js';

var camera, controls, scene, renderer; 
const mouse = new THREE.Vector2();


var ecrouCentre ;
var childrens = [];
// stocke les états
var aiguilles = []; var cadrans = []; var ecrouLaitons = []; var tirettes = [];
// stocke les objets mobiles
var objectMove = [];

// boleen pour l'etat de la souris (down)
var down = 0;
// variable si un evenement est déclenché
var evenement = null;
var raycaster = new THREE.Raycaster();
var nbanimationsRZ = 80;
//  numero de la tirette ou ecrou
var num
// variable pour stocker les evenements
var animeReturnZero;
init();
renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
animate();

function init() {

     // Scene
     scene = new THREE.Scene();
     scene.background = new THREE.Color( 0xD9EFFF );
     //scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

     // Rendu sur la page
     renderer = new THREE.WebGLRenderer( { antialias: true } );
     renderer.setPixelRatio( window.devicePixelRatio );
     renderer.setSize( window.innerWidth, window.innerHeight );
     document.body.appendChild( renderer.domElement );

     //Camera
     camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
     camera.position.set( 20, 20, 0 );

     // Controles
     controls = new OrbitControls( camera, renderer.domElement );
     controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
     controls.dampingFactor = 0.05;
     controls.screenSpacePanning = false;
     controls.minDistance = 5;
     controls.maxDistance = 30;

   // instantiate a loader 
   var loader = new ColladaLoader();
   // instancie une roue
   loader.load( 'modeles_3D/arithmaurel.dae',

       // Function when resource is loaded

       function (collada) {
         
          for(var i = 0 ; i < collada.scene.children.length  ; i++){ childrens.push(collada.scene.children[i]); }
          // affichage de la scene
          childrens = collada.scene.children;
           scene.add(collada.scene);
           console.log(collada.scene.children)
          console.log("ok")
          // recuperations des elements
         stockeObject()
        //   scene.add(collada.scene.children[2]);
		   
       },
       // Function called when download progresses
       function (xhr) {
           console.log((xhr.loaded / xhr.total * 100) + '% loaded');
       }
   );
   // charger et positionner les autres éléments en dupliquant le code précédent

     // Lumiere
     /*
     var light = new THREE.DirectionalLight( 0xffffff );
     light.position.set( 1, 1, 1 );
     scene.add( light );

     var light = new THREE.DirectionalLight( 0x002288 );
     light.position.set( - 1, - 1, - 1 );
     scene.add( light );

     var light = new THREE.AmbientLight( 0x222222 );
     scene.add( light );
     */
     var lightAmb = new THREE.AmbientLight (0xffffff)
     scene.add(lightAmb)
     
     window.addEventListener( 'resize', onWindowResize, false );
}

// fonction qui initialise les objets mobiles
// objectMove contient la liste des objets mobiles
// on initialise en meme temps les etats des objets qui  peuvent varier après évènement
function stockeObject(){
     ecrouCentre = childrens[24];
     ecrouCentre.rotation.x += Math.PI/5
     objectMove.push(ecrouCentre.children[0])
     objectMove.push(ecrouCentre.children[1])
     objectMove.push(ecrouCentre.children[2])

     for(let i = 0; i <= 7; i++){
          cadrans.push(childrens[i])
     }
     //console.log(cadrans)

     for(let i = 12 ;i <= 19; i++){
          tirettes.push(childrens[i])
          objectMove.push(childrens[i].children[12])
          objectMove.push(childrens[i].children[10])
          
     }
     //console.log(tirettes)
     for(let i = 8 ;i <= 11; i++){
          aiguilles.push(childrens[i])
     }
     aiguilles.reverse()
     //console.log(aiguilles)
     for(let i = 20 ;i <= 23; i++){
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
     renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
     requestAnimationFrame( animate );
     //console.log(objectMove[0])
     controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
     renderer.render( scene, camera );
}



/**
 * Lorsque la souris bouge, met a jour coordonnee de la souris 
 * permet de faire bouger les elements si le click est enfoncée
 */
function onDocumentMouseMove(event){
  
     // recupere position de la souris quand on bouge
     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  //   console.log(mouse)

     if(down &&  evenement != null && evenement[0] != 'R'){
          switch(evenement[0]){
               // l'ecrou bouge
               case 'E':
                    console.log(evenement[5])
                    num = evenement[5] - 1;
                    console.log(num)
                    animeEcrou()
                    break;
               // la tirette bouge
               case 'T':
                    console.log("tirette");
                    num = evenement[7] -1;
                    console.log(num)
                    animeTirette()
                    break;
          }
          console.log("evenement appuye")
     }
     // si on a le bouton down et que un objet a ete selectionne, on peut bouger l'objet
     raycaster.setFromCamera( mouse, camera );


}

/**
 * traite l'evenement up dans ce cas redonne le controle a l'utilisateur ou termine evenement lorsque l'on bouge les parties mobiles 
 */
function onDocumentMouseUp(event){
     down = 0;
     console.log("up")
     document.body.style.cursor = 'auto' ;
     controls.enabled = true;
     evenement = null;
}


function onDocumentMouseDown(event){
     down = 1;
     console.log("down")
     raycaster.setFromCamera( mouse, camera );
    // stoppe le controle sur les deplacements pour pouvoir bouger l'objet
   
     // quand on appuie sur la souris, teste si on intercepte un objet mobile
     // puis on traite les différents cas en fonction de l'objet selectionné
     // ecrou laiton, ecrouCentre, tirette
	const intersects = raycaster.intersectObjects(objectMove);
     
    // detection
     if ( intersects.length > 0 ) {
          controls.enabled = false;
          evenement = intersects[0].object.parent.name;
          switch( evenement[0]){
               case 'R': 
                    console.log("cle de remise a zero")
                    animeRAZ();
                    break;
          }


         document.body.style.cursor = 'ns-resize' ;
       
          console.log(evenement)
     }

     // on stoppe le control pour la position de l'arithmmaurel
    // controls.enabled = false;
}

function animeRAZ(){
     nbanimationsRZ --;
     animeReturnZero = requestAnimationFrame(animeRAZ);
     if(nbanimationsRZ >= 40){
          ecrouCentre.rotation.x -= Math.PI/100;
     }
     else {
          ecrouCentre.rotation.x += Math.PI/100;
     }
    // objectParent.parent.rotation.x -= Math.PI/50;
   
     renderer.render( scene, camera );
     
     if(nbanimationsRZ == 0){
          console.log("fini")
          nbanimationsRZ  = 80;
          window.cancelAnimationFrame(animeReturnZero);	

     }
}

function animeTirette(){

}


function animeEcrou(){

}