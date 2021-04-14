import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { ColladaLoader } from './lib/ColladaLoader.js';

var camera, controls, scene, renderer;

init();
animate();

function init() {

     scene = new THREE.Scene();
     scene.background = new THREE.Color( 0xD9EFFF );
     //scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

     renderer = new THREE.WebGLRenderer( { antialias: true } );
     renderer.setPixelRatio( window.devicePixelRatio );
     renderer.setSize( window.innerWidth, window.innerHeight );
     document.body.appendChild( renderer.domElement );

     camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
     camera.position.set( 20, 20, 0 );

     // controls
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
         // var dae = collada
         console.log(collada.scene)
         scene.add(collada.scene);
       
        //   scene.add(collada.scene.children[2]);
		   
       },
       // Function called when download progresses
       function (xhr) {
           console.log((xhr.loaded / xhr.total * 100) + '% loaded');
       }
   );
   // charger et positionner les autres éléments en dupliquant le code précédent

     // lights
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

function onWindowResize() {
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
     requestAnimationFrame( animate );
     controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
     render();
}

function render() {
     renderer.render( scene, camera );
}
