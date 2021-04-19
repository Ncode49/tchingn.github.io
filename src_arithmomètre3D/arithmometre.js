if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer;
var pickingData = [], pickingTexture, pickingScene;
var particleLight;
var objects = [], cadran = [], cylindre = [], sysRetenue = [], curseur = [], engrCompt = [], axeEngr = [], cursRetenu = [], axeManivelle, axePinc, parquet, dae;
var sysRetourRetenue = [], camAntiDepas = [], boiteChariot, barreAddSub, boiteAvant, boiteArriere, axeActionCompteur = [], boiteDessus, curseurActionCompteur, plaque = [];
var compteur = [],engrAccu =[], accumulateur = [], pignonRAZAccu, pignonRAZCompteur, peigneAccu, peigneCompteur, scaleDefault; 
var TargetPos = [] ,  ValCurProg ;
var toucheBloque = false;
var reverseurSurAdd = true ;
var positionIntialCurseurs = [], positionInitialMesh = [];
var positionIntialcurseurRetenue, positionInitialAntiDepas;
var remetreBoite = false ; var remetreChariot = false ; 
var valNumAccu = 0 ;
var valNumCompteur = 0 ;

var parcoursSysRet = [], click;

var highlightBox,velocity = 0.05;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3( 10, 10, 10 );
var INTERSECTED, SELECTED = null;
var plane;
var cubeMesh = [];
var pasDecalage;

var curseurRetenue = [];
var doubleEngrenage = [];
var groupChariot , pivotChariot ;

var offsetCurseur = 0.2 ;
var pitchCurseur = 0.104 ;


var loader = new THREE.ColladaLoader();
var progress = document.getElementById('progression');
loader.options.convertUpAxis = true;
loader.setCrossOrigin("anonymous");
loader.load( 'test/Export/Arithmometre-Export.dae', function ( collada ) {
	// stocke l'objet dans dae
	dae = collada.scene;
	dae.traverse( function ( child ) {});
	dae.scale.x = dae.scale.y = dae.scale.z = 1;
	dae.updateMatrix();
	init();
	animate();

	},function( xhr ){
		if (xhr.lengthComputable)
		{		
			progress.value = xhr.loaded / xhr.total * 100;
			progress.getElementsByTagName('span')[0].innerHTML = Math.floor(xhr.loaded / xhr.total * 100).toString() + " %";
	//		console.log( progress.value + '% loaded' );
			if( progress.value == 100)		
				document.body.removeChild(progress);
		}
	}
) ;

loader.onLoadComplete = function () {
	document.body.removeChild(progress);
	console.log('fin de chargement') ;
} ;
	
function init() {
	container = document.createElement( 'div' );
	container.id = 'container';
	document.body.appendChild( container );

	// Camera
	camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1 , 2000 );
	camera.position.set( 12.0970, 24.1940, 0);
	camera.up.set(0,1,0);
	// camera.zoom = 0.1;
	// camera.rotateOnAxis(new THREE.Vector3(0, 0, 0), 90 * Math.PI / 180 );

	// Controles
	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 6;
	controls.zoomSpeed = 1;  // was 2
	controls.panSpeed = 2;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = false;
	controls.dynamicDampingFactor = 0.5;
	
	scene = new THREE.Scene();

	pickingScene = new THREE.Scene();
	pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
	pickingTexture.minFilter = THREE.LinearFilter;
	pickingTexture.generateMipmaps = false;

	// Add the COLLADA instancie chacun des objets et met que les element important
	var longueurDAE = dae.children.length  // 87 objects
	for(var i = 0 ; i < longueurDAE ; i++){ objects.push(dae.children[i]); }
	// stocke dans les variables
	for(i = 0 ; i < longueurDAE ; i++){ scene.add(objects[i]); }

	//console.log(objects);

	// 
	axePrinc = objects[29];
	barreAddSub = objects[41]; // 100Â° (add) Ã  -90Â° (sous)
	boiteArriere = objects[42];
	boiteAvant = objects[43]; 
	boiteCentre = objects[44];
	boiteDessous = objects[45];
	boiteDessus = objects[40];
	boiteDroite = objects[46];
	boiteGauche = objects[47];
	boiteChariot = objects[39];
	axeActionCompteur[0] = objects[12];
	axeActionCompteur[1] = objects[13];

	scene.remove(boiteChariot.children[1]);
	scene.remove(boiteDessus.children[1]);
	accumulateur[0] = objects[0];
	accumulateur[1] = objects[4];
	accumulateur[2] = objects[5];
	accumulateur[3] = objects[6];
	accumulateur[4] = objects[7];
	accumulateur[5] = objects[8];
	accumulateur[6] = objects[9];
	accumulateur[7] = objects[10];
	accumulateur[8] = objects[11];
	accumulateur[9] = objects[1];
	accumulateur[10] = objects[2];
	accumulateur[11] = objects[3];

	// console.log(accumulateur[0].position.z-accumulateur[1].position.z);
	pasDecalage = (accumulateur[1].position.z - accumulateur[0].position.z) - 0.045;
	// stocke les enfants de chaque objets
	for (var i=0; i<=5; i++)
	{
		engrAccu[i] = accumulateur[i].children[2];
		engrAccu[i+6] = accumulateur[i+6].children[2];
		compteur[i] = objects[i+14];
		cylindre[i] = objects[i+21];	
		camAntiDepas[i] = cylindre[i].children[3];
		axeEngr[i] = objects[i+30];
		curseur[i] = objects[i+49];		
		curseurRetenue[i] = objects[i+55];
		doubleEngrenage[i] = objects[i+63];	
		engrCompt[i] = objects[i+71];
		sysRetenue[i] = objects[i+83];
		sysRetourRetenue[i] = objects[i+90];
	}
	engrAccu[11] = accumulateur[11].children[2];

	
	compteur[6] = objects[20];
	cylindre[6] = objects[27];
	cylindre[7] = objects[28];
	camAntiDepas[6] = cylindre[6].children[2];
	camAntiDepas[7] = cylindre[7].children[2];
	axeEngr[6] = objects[36];
	axeEngr[7] = objects[37];
	axeManivelle = objects[38];
	curseurRetenue[6] = objects[61];
	curseurRetenue[7] = objects[62];
	doubleEngrenage[6] = objects[69];
	doubleEngrenage[7] = objects[70];
	peigneAccu = objects[78];
	peigneCompteur = objects[79];
	pignonRAZAccu = objects[80];
	pignonRAZCompteur = objects[81];
	sysRetenue[6] = objects[89];


	sysRetourRetenue[6] = objects[96];
	plaque[0] = objects[82];
	plaque[1] = plaque[0].children[1];
	
	groupChariot = new THREE.Group();
	groupChariot.add (boiteChariot) ; scene.remove(boiteChariot);
	groupChariot.add (peigneAccu) ; scene.remove(peigneAccu);
	groupChariot.add (peigneCompteur) ; scene.remove(peigneCompteur);
	groupChariot.add (pignonRAZAccu) ; scene.remove(pignonRAZAccu);
	groupChariot.add (pignonRAZCompteur) ; scene.remove(pignonRAZCompteur);
	for(var i=0; i<accumulateur.length; i++){
		groupChariot.add (accumulateur[i]); scene.remove(accumulateur[i]);
	}
	for(var i=0; i<compteur.length; i++){
		groupChariot.add (compteur[i]) ; scene.remove(compteur[i]);
	}
	
	var offsetX = 1.31 ;  // position du pivot
	var offsetY = 1.30 ;
	pivotChariot = new THREE.Object3D();
	pivotChariot.position.x -= offsetX ;
	pivotChariot.position.y += offsetY ;
	groupChariot.position.x += offsetX ;
	groupChariot.position.y -= offsetY ;
	pivotChariot.add(groupChariot);
    scene.add(pivotChariot);
	

	
// corriger la position initiale des cames anti dÃ©passement et des curseurs
// dupliquer les cames sauf la premiÃ¨re
	camAntiDepas[0].children[0].rotation.y -= 5*Math.PI/10 ;
	camAntiDepas[0].children[0].position.y += 0.20 ;
	for (var k=1; k < 6; k++){ 
		camAntiDepas[k].add (camAntiDepas[k].children[0].clone() ) ;
		camAntiDepas[k].children[0].rotation.y -= 5*Math.PI/10 ;
		camAntiDepas[k].children[0].position.y += 0.30 ;
		camAntiDepas[k].children[1].rotation.y -= 4*Math.PI/10 ;		
		camAntiDepas[k].children[1].position.y -= 0.75 ;
		}
	camAntiDepas[6].children[0].rotation.y -= 4*Math.PI/10 ;
	camAntiDepas[6].children[0].position.y += 0.20 ;
	camAntiDepas[7].children[0].rotation.y -= 4*Math.PI/10 ;
	camAntiDepas[7].children[0].position.y += 0.20 ;
	
	for (var k=1; k < curseurRetenue.length ; k++)
		{ curseurRetenue[k].position.x += 0.03	}
	
	positionInitialAntiDepas = camAntiDepas[1].position.y ;
	positionIntialcurseurRetenue = curseurRetenue[1].position.x ; 
	

	lamp = objects[77];
	// Objet 77 est dÃ©jÃ  engrCompt[6]
	// scaleDefault = cadran[0].scale;

	scene.remove(parquet);
	scene.remove(lamp);

		// Cube Mesh

//	var material = new THREE.MeshLambertMaterial( { color: 0xff0000, opacity: 0.2, transparent: true, visible: true } );
	var material = new THREE.MeshLambertMaterial( { visible: false } );
	
	var geometryRenv = new THREE.BoxGeometry(0.8,0.3,0.8);
	var geometryCur = new THREE.BoxGeometry(1.5,0.5,0.5);  
	var renverseurMesh = new THREE.Mesh( geometryRenv, material );
	var manivelleMesh = new THREE.Mesh( geometryRenv, material );
	var RAZtotalMesh = new THREE.Mesh( geometryRenv, material );
	var RAZcomptMesh = new THREE.Mesh( geometryRenv, material );
	var deplaceMesh = curseur[0].position.x - 0.3;

	renverseurMesh.position.x = deplaceMesh + 0.8;
	renverseurMesh.position.y = 0.973 + 0.5;
	renverseurMesh.position.z = -5.380 + 7.87; 
	renverseurMesh.name = "renverseur";
	scene.add( renverseurMesh );

	RAZtotalMesh.position.x = deplaceMesh - 1.3;
	RAZtotalMesh.position.y = 0.973 + 0.5;
	RAZtotalMesh.position.z = -5.380 + 12.6; 
	RAZtotalMesh.name = "RAZtotalisateur";
	scene.add( RAZtotalMesh );

	manivelleMesh.position.x = deplaceMesh + 0.9;  // axe y de l'Ã©cran, inversÃ©
	manivelleMesh.position.y = 0.973 + 0.5;  // axe z de l'Ã©cran. Surface face avant
	manivelleMesh.position.z = 0.01 - 6.5;  // axe x de l'Ã©cran, inversÃ©
	manivelleMesh.name = "manivelle";
	scene.add( manivelleMesh );

	RAZcomptMesh.position.x = deplaceMesh - 1.0;
	RAZcomptMesh.position.y = 0.973 + 0.5;
	RAZcomptMesh.position.z = 0.01 - 6.45; 
	RAZcomptMesh.name = "RAZeroCompteur";
	scene.add( RAZcomptMesh );


	for(var i = 0; i!= curseur.length; i++){
		var curseurMesh = new THREE.Mesh( geometryCur, material );
		curseurMesh.name = "cur_"+i;
		curseurMesh.position.x = deplaceMesh + 0.4 ; 
		curseurMesh.position.y = curseur[i].position.y + 0.7; // was +0.2
		curseurMesh.position.z = curseur[i].position.z;
		scene.add( curseurMesh );
		curseurMesh.geometry.computeBoundingBox();
		cubeMesh.push( curseurMesh );  // 0 Ã  5
	}
	cubeMesh.push( renverseurMesh );  // 6
	cubeMesh.push( manivelleMesh );   // 7
	cubeMesh.push( RAZtotalMesh );    // 8
	cubeMesh.push( RAZcomptMesh );    // 9

	// for(var i = 0; i<cadran.length;i++){
	// 	console.log(cadran[i].rotation);
	// }

	// console.log(cadran);

	particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
	//scene.add( particleLight );

	// Lights

	scene.add( new THREE.AmbientLight( 0xcccccc ) );

	var directionalLight = new THREE.DirectionalLight(0xeeeeee );
	directionalLight.position.x = 1;
	directionalLight.position.y = 1;
	directionalLight.position.z = 1;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	var pointLight = new THREE.PointLight( 0xffffff, 4 );
	particleLight.add( pointLight );

	highlightBox = new THREE.Mesh(
		new THREE.BoxGeometry( 1, 1, 1 ),
		new THREE.MeshLambertMaterial({ color: 0xffff00 })
	 );
	scene.add( highlightBox );

	var material = new THREE.LineBasicMaterial({ color: 0x0000ff});
	

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( -10, 0, 0 ),
		new THREE.Vector3( 0, 10, 0 ),
		new THREE.Vector3( 10, 0, 0 )
	);


	plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 20, 20, 15, 10 ),
		new THREE.MeshBasicMaterial( { visible: false } )
	);
	plane.rotation.x -= Math.PI/2;
	plane.position.y += 0.8;
	plane.position.z -= 5;
	scene.add( plane );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	//document.body.appendChild(renderer.domElement);

	window.addEventListener( 'resize', onWindowResize, false );

	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
	renderer.setClearColor(0xd9efff);
	window.onclick = function(){
		//console.log(cubeMesh[0].position);
		// console.log(camera.up); 
	};
//if(document.body.children(progress)!= null) document.body.removeChild(progress);  // la barre reste parfois ???
	if (document.getElementById('progression')!= null) document.body.removeChild(progress); 
	var patientez = document.getElementById('Patienter'); patientez.parentNode.removeChild(patientez);
	VuExemple (true) ;
	document.getElementById('choixLangIcon').style.visibility = 'visible' ;
	
//console.log	(boiteDessus.children[1].children.length) ;
}   // fin de la fonction Init
//

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	lamp.position.z = -mouse.x *15;
	lamp.position.x = -mouse.y *15;
	lamp.position.y = 5;
	
	raycaster.setFromCamera( mouse, camera );

	if ( SELECTED && !toucheBloque && SELECTED.name != "renverseur" && SELECTED.name != "manivelle" 
				&& SELECTED.name != "RAZtotalisateur" && SELECTED.name != "RAZeroCompteur" ) {
		var intersects = raycaster.intersectObject( plane );

		if ( intersects.length > 0 ) {
			SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
		}
		return;
	}
	
	// intersection avec un objet mobile
	var intersects = raycaster.intersectObjects( cubeMesh );
	// si une intersection
	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
			if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			plane.position.copy( INTERSECTED.position );
			plane.lookAt( camera.position );
		}
		// change en pointeur tout les objet mobiles
		container.style.cursor = 'pointer';
	} else {
		if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
		INTERSECTED = null;
		container.style.cursor = 'auto';		
	}
}

function onDocumentMouseDown( event ) {
	event.preventDefault();
	click = true;
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( cubeMesh );
	if ( intersects.length > 0) {
		controls.enabled = false;
		// select est l'objet selectionnee
		SELECTED = intersects[ 0 ].object;
		var intersects = raycaster.intersectObject( plane );
		if ( intersects.length > 0 ) {
			offset.copy( intersects[ 0 ].point ).sub( plane.position );
		}
		if ( SELECTED && (SELECTED.name == "renverseur" || SELECTED.name == "manivelle" 
			|| SELECTED.name == "RAZtotalisateur" || SELECTED.name == "RAZeroCompteur") )
			{container.style.cursor = 'cell'}
		else {container.style.cursor = 's-resize'};
	}
	if(SELECTED && !toucheBloque){
		if(SELECTED.name == "renverseur" ){ initRenverseur(); }
		if(SELECTED.name == "manivelle" ){ initialise(); }
		if(SELECTED.name == "RAZtotalisateur" ){ 
			if (event.button == 0) {appelRAZaccu()} else {verifDecMoins(1)} ; }
		if(SELECTED.name == "RAZeroCompteur" ){ 
			if (event.button == 0) {appelRAZcompteur()} else {verifDecPlus(1)} ; }
	}
}

function curseurMove(){
	controls.enabled = true;
	if ( INTERSECTED ) {
		plane.position.copy( INTERSECTED.position );
		for(var j = 0; j<curseur.length ; j++){
			// si on clique et que l'on a selectionné un curseur
			if (click && SELECTED){
				// si le nom selectionne est le curseur numero j
				if(SELECTED.name == "cur_"+j  && !enCours){
					// po
					for (var k = 0; k < 10; k++) {
						if (SELECTED.position.x < 0.764 + k * pitchCurseur) {
							if ( oldValCur != k)
							{
								// change le valeur stocké
								positionCurseur[j] = 9-k ;
								// affiche sur le bouton
								SpitCurseurNum () ;
								// jour le son
								playNcliks(Math.abs(oldValCur - k)) ;
								oldValCur = k ;
							}
							return ;
						}	
					}
				}
			}
		}
	}
}

function onDocumentMouseUp( event ) {
	event.preventDefault();
	click = false;
	controls.enabled = true;
	if ( INTERSECTED ) {
		plane.position.copy( INTERSECTED.position );
		for(var j = 0; j<curseur.length ; j++){
			if (SELECTED){
				if(SELECTED.name == "cur_"+j){
					if(!enCours){
						var k =  Math.floor ((SELECTED.position.x - 0.764)/pitchCurseur ) ;
						k = Math.max(0, Math.min(9,k+1)) ;
						curseur[j].position.x = 0.764 + (k - 0.5) * pitchCurseur - offsetCurseur;
						positionCurseur[j] = 9-k ;
						engrCompt[j].position.x = curseur[j].position.x + 0.1 ;
					}
					SELECTED.position.z = curseur[j].position.z;
					SELECTED.position.x = curseur[j].position.x + offsetCurseur;
					SELECTED.position.y = curseur[j].position.y + 0.2;
				}
			}
		}		
		SELECTED = null;
	}
	container.style.cursor = 'auto';
}

// change la valeur du curseurr dans le bouton et le met a jour
function SpitCurseurNum (){
	document.getElementById('curseurNum').innerHTML = '&nbsp;';
	for(var j = curseur.length -1; j>= 0 ; j--) {
		document.getElementById('curseurNum').innerHTML += positionCurseur[j] + '&nbsp;'  ;
	}	
}

function choixMaterial(n){
	switch(n){
		case 1:
			boiteDessus.children[1].children[0].material.map = THREE.ImageUtils.loadTexture('test/Export/DessusBois.jpg');
			break ;
		case 2 :
			boiteDessus.children[1].children[0].material.map = THREE.ImageUtils.loadTexture('test/Export/DessusLaiton.jpg');
			break ;
		case 3 :
			boiteDessus.children[1].children[0].material.map = THREE.ImageUtils.loadTexture('test/Export/DessusArgent.jpg');
			break ;				
		}
}

function vueFace(){	
	// -1.5707963175446267 0.46364760301390534 1.5707963175446267
	vueChange(12.0970, 24.1940, 0,   0, 1, 0)
}
function vueDessus(){
		// -1.6227656184185628 0.14334873463763073 1.58089393050449
	vueChange(3.6339, 25.1422, -1.3078,   -0.3148, 0.9482, -0.0448);
}

function vueDessous(){
	// 1.5598496385178457 0.09286563517133524 1.5686825253309304
	vueChange( 2.4733, -26.5549, 0.2907,   -0.4185, -0.9081, 0.0110);
	var light = new THREE.HemisphereLight( 0xffffaa, 0xcccccc, 0.2 );
	light.position.set(camera.position);
	scene.add( light );
}

function vueGauche(){
	// -0.10983867931076954 0.04850620551452055 1.5100411499112198
	vueChange( 1.1972, 2.7034, 24.5134,   -0.44288, 0.1276, 0.88744); 
}

function vueDroite(){
	// -3.031753974279024 0.04850620178484342 1.7084862913559518
	vueChange( 1.1972, 2.7034, -24.5134,   -0.4120, 0.16238, -0.8965);
}

var dPosX, dPosY, dPosZ, dUpX, dUpY, dUpZ, dRotX, dRotY, dRotZ, pasChange ;

function vueChange(posX, posY, posZ, upX, upY, upZ){
// console.log (camera.rotation.x, camera.rotation.y, camera.rotation.z )
	pasChange = 16 ;
// verifier ici que la distance n'est pas trop importante
	if (Math.abs(camera.position.x * camera.position.y * camera.position.z) > 1200 )
	{pasChange = 1 ;}
	dPosX = (camera.position.x - posX)/pasChange ;
	dPosY = (camera.position.y - posY)/pasChange ;
	dPosZ = (camera.position.z - posZ)/pasChange ;
	dUpX = (camera.up.x - upX)/pasChange ;
	dUpY = (camera.up.y - upY)/pasChange ;
	dUpZ = (camera.up.z - upZ)/pasChange ;
	vueChangeProg() ;
}

function vueChangeProg(){
	animvueChangeProg = requestAnimationFrame( vueChangeProg );
	if (pasChange > 0){
		camera.position.x -= dPosX; camera.position.y -= dPosY; camera.position.z -= dPosZ;	// rotation	
		camera.up.x -= dUpX; camera.up.y -= dUpY; camera.up.z -= dUpZ;  // uniquement pivotement de la camÃ©ra
		pasChange -- ;
	} else {
		controls = new THREE.TrackballControls( camera );
		camera.lookAt(scene.position);
		window.cancelAnimationFrame(animvueChangeProg);	
	}	
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	if ( SELECTED ) {
		if(SELECTED.position.x < 1.7 && SELECTED.position.x > 0.66 && !enCours){
			for(var i = 0;i<curseur.length;i++){
				if(SELECTED.name == "cur_" + i){
					curseur[i].position.x = SELECTED.position.x - offsetCurseur;
					engrCompt[i].position.x = curseur[i].position.x + 0.1;
				}
			}
		}
	}
	curseurMove();
	render();
	// stats.update();
}

function pick() {
	//render the picking scene off-screen
	renderer.render( pickingScene, camera, pickingTexture );
	//create buffer for reading single pixel
	var pixelBuffer = new Uint8Array( 4 );
	//read the pixel under the mouse from the texture
	renderer.readRenderTargetPixels(pickingTexture, mouse.x, pickingTexture.height - mouse.y, 1, 1, pixelBuffer);
	//interpret the pixel as an ID
	var id = ( pixelBuffer[0] << 16 ) | ( pixelBuffer[1] << 8 ) | ( pixelBuffer[2] );
	var data = pickingData[ id ];
	if (data) {
		//move our highlightBox so that it surrounds the picked object
		if ( data.position && data.rotation && data.scale ){
			highlightBox.position.copy( data.position );
			highlightBox.rotation.copy( data.rotation );
			highlightBox.scale.copy( data.scale ).add( offset );
			highlightBox.visible = true;
		}
	} else { highlightBox.visible = false; }
}

var clock = new THREE.Clock();
var toursSur20 = [];
toursSur20[0] = Math.PI/10;
var tps   = 1/5 * 2*Math.PI;	

function render() {
	var timer = Math.round(Date.now()*0.001);
	camera.lookAt( scene.position );
	controls.update();

	pick();

	renderer.render( scene, camera );

}

var departTour, dureeTour ; //mesure de performance
var attenteOne = 420 ;
var animTourne ;
var tournePlus = true ;
var positionCurseur=[0,0,0,0,0,0] ;
var enCours = false ;
var enCoursEx = false ;  //exemple en cours d'exÃ©cution


function initialise(){
//console.log(camera.position);
//console.log(camera.up);

	if(!enCours){
		if(document.getElementById('normale').checked) BruitTour.play();
		toutBloquer(true);
		enCours=true;
		for(var i = 1;i<curseur.length+4;i++){
			toursSur20[i]=Math.PI/10;
		}
		departTour = performance.now();
		initVingtTour();
	}
}

var positionAccu = [0,0,0,0,0,0,0,0,0,0,0,0];
var RenverseurSurSous = false;
var positionDecalage = 0;
var positionCompteur = [0,0,0,0,0,0,0];

// indiquateur la fin d'un vingtieme de tour
var finVingtTour;
// numero du vingtieme de tour parcouru
var noVingtieme;
// tableaux des parours restants

var parcoursCurseurRetenueTrans=[], retTransAct = [], retAct = [], parcoursDoubleEngr = [], parcoursCurseurRetenue = [], parcoursAccu = [], parcoursAxeEngr = [], parcoursEngrCompt = [], parcoursMavinelle = [], parcoursAxePrinc = [], parcoursCylindre = [];
var tourFini;
var compteurPassed = false;

function initVingtTour(){
	// initialisation du numero de vingtieme en cours
	noVingtieme = 0;
	// initialisation des parcours restants
	parcoursMavinelle[0] = Math.PI/10;
	parcoursAxePrinc[0] = Math.PI/10;
	for(var i = 0; i<accumulateur.length; i++){
		parcoursAccu[i] = Math.PI/10;
	}
	for(var i = 0; i<engrCompt.length; i++){
		parcoursAxeEngr[i] = Math.PI/10;
		parcoursEngrCompt[i] = Math.PI/10;
		parcoursDoubleEngr[i] = Math.PI/10;
	}
	for(var i = 0; i<cylindre.length; i++){
		parcoursCylindre[i] = Math.PI/10;
		parcoursCurseurRetenue[i] = Math.PI/10;
	}
	for(var sysR = 0; sysR<sysRetenue.length; sysR++){
		parcoursSysRet[sysR]=Math.PI/18;
		parcoursCurseurRetenueTrans[sysR]=0.08;
		retAct[sysR]=false;
		retTransAct[sysR]=false;
	}
	tourFini = compteurPassed = tourneSysRetAlle = finTransRet = false;
	process();
	tourneVingtieme();
}


function tourneAccu ( accum, noV ){
	var signe = MAT_ACC[noV][accum];
	// console.log("ligne lu "+MAT_ACC[noV]);
	if(signe == 1){
		tournePiece ( 2, accumulateur[accum], 'y', '+', 2, accum, parcoursAccu);
		if(accum - positionDecalage < doubleEngrenage.length && accum - positionDecalage >= 0){
			tournePiece ( 2, axeEngr[accum - positionDecalage], 'x', '-', 2, accum - positionDecalage, parcoursAxeEngr);
			tournePiece ( 2, doubleEngrenage[accum - positionDecalage], 'x', '-', 2, accum - positionDecalage, parcoursDoubleEngr);
		}
		if(accum - positionDecalage < engrCompt.length && accum - positionDecalage >= 0)
			tournePiece ( 2, engrCompt[accum - positionDecalage], 'x', '-', 2, accum - positionDecalage, parcoursEngrCompt);
	}
	else if(signe == -1){
		tournePiece ( 2, accumulateur[accum], 'y', '-', 2, accum, parcoursAccu);
		if(accum - positionDecalage < doubleEngrenage.length && accum - positionDecalage >= 0){
			tournePiece ( 2, axeEngr[accum - positionDecalage], 'x', '-', 2, accum - positionDecalage, parcoursAxeEngr);
			tournePiece ( 2, doubleEngrenage[accum - positionDecalage], 'x', '-', 2, accum - positionDecalage, parcoursDoubleEngr);
		}
		if(accum - positionDecalage < engrCompt.length && accum - positionDecalage >= 0)
			tournePiece ( 2, engrCompt[accum - positionDecalage], 'x', '-', 2, accum - positionDecalage, parcoursEngrCompt);
	}
	else if(signe == 0){
		parcoursAccu[accum]=0;
		if(accum - positionDecalage < engrCompt.length && accum - positionDecalage >= 0){
			parcoursAxeEngr[accum - positionDecalage]=0;
			parcoursEngrCompt[accum - positionDecalage]=0;
			parcoursDoubleEngr[accum - positionDecalage]=0;
		}
	}
}


function tourneVingtieme(){
	animTourneV = requestAnimationFrame( tourneVingtieme );
	if (noVingtieme <= 19) {
		if(noVingtieme == 13  && !compteurPassed && RenverseurSurSous){
			initDecCompteur();
		}
		if(noVingtieme == 17  && !compteurPassed && !RenverseurSurSous){
			initIncrCompteur();
		}
		if(entrainement()){
			initInter();
			noVingtieme++;
		}
	} else {		 
		positionAccu = MAT_ACC_FIN;
		if(!enCoursEx){
			toutBloquer(false);
		}
		enCours=false;
		BruitTour.pause();  // pour arreter le bruit
		if ( BruitTour.seekable.length > 0 ) { BruitTour.currentTime = 0 ; } ;
/*
		for (k=1; k<curseurRetenue.length ; k++)
		{
			curseurRetenue[k].position.x = positionIntialcurseurRetenue; 
			camAntiDepas[k].position.y = positionInitialAntiDepas;
			sysRetenue[k-1].rotation.y = 0.0 ;
		}
*/
		window.cancelAnimationFrame(animTourneV);
		dureeTour = Math.round(performance.now() - departTour) ;
//		console.log("DurÃ©e d'un tour de manivelle : " + dureeTour + " millisecondes.");
	} 
}

	
function entrainement(){
	finVingtTour = true;
	tournePiece ( 1, axeManivelle, 'y', '-', 1, 0, parcoursMavinelle);
	tournePiece ( 1, axePrinc, 'y', '-', 1, 0, parcoursAxePrinc);
	for(var cyl = 0; cyl<cylindre.length; cyl++){
		tournePiece( 1, cylindre[cyl], 'x', '+', 1, cyl, parcoursCylindre);
		tournePiece( 1, curseurRetenue[cyl], 'x', '+', 1, cyl, parcoursCurseurRetenue);
	}
	var t = noVingtieme;
	for(var accu = 0; accu < accumulateur.length; accu++){
		tourneAccu(accu, t);
	}

	// Retenue
	for(var sysR = 0; sysR < sysRetenue.length; sysR++){
		if(MAT_RET[t][sysR+1] == 1){
			retAct[sysR]=true;
			retTransAct[sysR]=true;
		}
		if(retAct[sysR]){
			tourneSysRet(sysR, t);
		}
		if(retTransAct[sysR]){
			translateRet(sysR, t);
		}
	}


	// verification fin vingtieme tour
	if(parcoursMavinelle[0]>0){finVingtTour=false;}
	if(parcoursAxePrinc[0]>0){finVingtTour=false;}
	for (var indice = 0; indice<parcoursAccu.length;indice++){
		if(parcoursAccu[indice]>0){finVingtTour=false;}
	}
	for (var indice = 0; indice<parcoursAxeEngr.length;indice++){
		if(parcoursAxeEngr[indice]>0){finVingtTour=false;}
		// console.log(indice + ":" + parcoursAxeEngr[indice]);
	}
	for (var indice = 0; indice<parcoursEngrCompt.length;indice++){
		if(parcoursEngrCompt[indice]>0){finVingtTour=false;}
	}
	return finVingtTour;
}

var tourneSysRetAlle, finTransRet;

function initInter(){
	tourneSysRetAlle = false;
	finTransRet = false;
	parcoursMavinelle[0] = Math.PI/10;
	parcoursAxePrinc[0] = Math.PI/10;
	for(var i = 0; i<accumulateur.length; i++){
		parcoursAccu[i] = Math.PI/10;
	}
	for(var i = 0; i<engrCompt.length; i++){
		parcoursAxeEngr[i] = Math.PI/10;
		parcoursEngrCompt[i] = Math.PI/10;
		parcoursDoubleEngr[i] = Math.PI/10;
	} 
	for(var i = 0; i<cylindre.length; i++){
		parcoursCylindre[i] = Math.PI/10;
		parcoursCurseurRetenue[i] = Math.PI/10;
	}
	for(var sysR; sysR<sysRetenue.length; sysR++){
		parcoursSysRet[sysR]=Math.PI/18;
		parcoursCurseurRetenueTrans[sysR]=0.08;
	}
}


var parcoursBarreAddSub = [], parcoursAxePlateau = [], parcoursPeigneAccu = [], parcoursPeigneCompteur = [], parcoursPignonAccu = [], parcoursPignonCompteur = [];
var soulevementChariot = [] ;
parcoursAxePlateau[0] = 1;
soulevementChariot[0] = soulevementC = Math.PI/18 ; // solever pour engrenages passent chariot


function setMovChariot (parm){
	parcoursAxePlateau[0] = parm;
	parcoursPeigneAccu[0] = parm;
	parcoursPeigneCompteur[0] = parm;
	parcoursPignonAccu[0] = parm;
	parcoursPignonCompteur[0] = parm;	
}


function verifDecPlus(n){
	var nPasDecalage = n*pasDecalage + (n-1)*0.045 ;
	if(!enCours && (positionDecalage+n) <= 6){
		if(document.getElementById('normale').checked) BruitDecalage.play();
		positionDecalage += n; sensDecalage = '-' ;
		parcoursAxePlateau[0] = nPasDecalage ;
		cubeMesh[8].position.z -= nPasDecalage ;
		cubeMesh[9].position.z -= nPasDecalage ;
		decalagePlus();
	}
}

function verifDecMoins(n){
	var nPasDecalage = n*pasDecalage + (n-1)*0.045 ;
	if(!enCours && (positionDecalage-n) >= 0){
		if(document.getElementById('normale').checked) BruitDecalage.play();			
		positionDecalage -= n; sensDecalage = '+' ;
		parcoursAxePlateau[0] = nPasDecalage ;
		cubeMesh[8].position.z += nPasDecalage ;
		cubeMesh[9].position.z += nPasDecalage ;
		decalagePlus();
	}
}

var etape = 1;
var sensDecalage ;

function decalagePlus(){
	animTourne = requestAnimationFrame( decalagePlus );
	toutBloquer(true);
	enCours = true;
	switch(etape){
		case 1:
			if(monterChariot('+')){
				soulevementChariot[0] = soulevementC ;
				etape++;
			}
			break;
		case 2:
			if(translaterChariot(sensDecalage)){
//				parcoursAxePlateau[0] = pasDecalage;
				etape++;
			}
			break;
		case 3:
			if(monterChariot('-')){
				soulevementChariot[0] = soulevementC ;
				etape = 1;
				if(!enCoursEx){ toutBloquer(false); }
				enCours = false;
				window.cancelAnimationFrame(animTourne);}
			break;
	}
}

function monterChariot(sens) {
//	translaterPiece(1,pivotChariot, 'y', sens, 0, parcoursAxePlateau);
	tournePiece(2, pivotChariot, 'z', sens, 2, 0, soulevementChariot);
	return (soulevementChariot[0]<0) ;
}

function translaterChariot(sens) {
	translaterPiece(1, pivotChariot, 'z', sens, 0, parcoursAxePlateau);
	return (parcoursAxePlateau[0]<0) ;
}


function translaterPiece ( vitesse, objet, axe, signe, i, tab){
	velocite();
	var a = tps * velocity * vitesse;
	if(signe =='+' && tab[i] > 0 ){
		if(axe == 'y')     { objet.position.y += a; }
		else if(axe == 'x'){ objet.position.x += a; }
		else if(axe == 'z'){ objet.position.z += a; }
		tab[i] -= a;
	}
	else if(signe == '-' && tab[i] > 0){
		if(axe == 'y')     { objet.position.y -= a; }
		else if(axe == 'x'){ objet.position.x -= a; }
		else if(axe == 'z'){ objet.position.z -= a; }
		tab[i] -= a;
	}
}

function tournePiece ( nb20emeTours, objet, axe, signe, vitesse, i, tab){
	velocite();
	var a = tps * velocity * vitesse ;
	if(signe =='+' && tab[i] > 0){
		if(axe == 'y')     { objet.rotation.y += a; }
		else if(axe == 'x'){ objet.rotation.x += a; }
		else if(axe == 'z'){ objet.rotation.z += a; }
		tab[i] -= a/nb20emeTours;
	}
	else if(signe == '-' && tab[i] > 0){
		if(axe == 'y')     { objet.rotation.y -= a; }
		else if(axe == 'x'){ objet.rotation.x -= a; }
		else if(axe == 'z'){ objet.rotation.z -= a; }
		tab[i] -= a/nb20emeTours;		
	}
}


function velocite(){
	if(document.getElementById('lente').checked) { velocity = 0.0025; }
	else  { velocity = 0.05; }
}
var parcoursPlaque = [];

function initRenverseur(){
	if(!enCours){
		if(document.getElementById('normale').checked) BruitInverseur.play() ;
		toutBloquer(true);
		enCours=true;
		parcoursPlaque[0]=0.185;
		parcoursCurseurRetenue[0]=0.100;
		for(var i=0; i<doubleEngrenage.length;i++){
			parcoursDoubleEngr[i]=0.185;
		}
		parcoursBarreAddSub[0]=Math.PI/10;
		changeRenverseur();
	}
}

function changeRenverseur(){
	animTourne = requestAnimationFrame( changeRenverseur );
	if(!RenverseurSurSous){
		translaterPiece(1,plaque[0],'x','+',0,parcoursPlaque);
		translaterPiece(1,curseurRetenue[0],'x','+',0,parcoursCurseurRetenue);
		for(var i=0; i<doubleEngrenage.length;i++){
			translaterPiece(1,doubleEngrenage[i],'x','+',i,parcoursDoubleEngr);
		}
		tournePiece(1,barreAddSub,'y','-',1,0,parcoursBarreAddSub);
	}
	else{
		translaterPiece(1,plaque[0],'x','-',0,parcoursPlaque);
		translaterPiece(1,curseurRetenue[0],'x','-',0,parcoursCurseurRetenue);
		for(var i=0; i<doubleEngrenage.length;i++){
			translaterPiece(1,doubleEngrenage[i],'x','-',i,parcoursDoubleEngr);
		}
		tournePiece(1,barreAddSub,'y','+',1,0,parcoursBarreAddSub);
	}
	if(parcoursPlaque[0]<=0 && parcoursCurseurRetenue[0]<=0 && parcoursBarreAddSub[0]<=0){
		RenverseurSurSous = ! RenverseurSurSous ;
		if(!enCoursEx){ toutBloquer(false); }
		enCours=false;
		window.cancelAnimationFrame(animTourne);
	}
}

var parcoursCompteur=[];
var parcoursAxeActionCompteur=[];

function incrCompteur(){
	animTourne = requestAnimationFrame( incrCompteur );
	tournePiece( 1, axeActionCompteur[0], 'x', '+', 1, 0, parcoursAxeActionCompteur);
	tournePiece( 1, axeActionCompteur[1], 'x', '-', 1, 1, parcoursAxeActionCompteur);
	tourneCompteur(positionDecalage,0,'+');
	if(parcoursCompteur[0]<0 && parcoursAxeActionCompteur[0]<0 && parcoursAxeActionCompteur[1]<0){
		window.cancelAnimationFrame(animTourne);
	}
}
function initIncrCompteur(){
	parcoursCompteur[0]=2*Math.PI/18;
	parcoursAxeActionCompteur[0]=Math.PI/5;
	parcoursAxeActionCompteur[1]=Math.PI/5;
	incrCompteur();
	compteurPassed = true;
}

function decCompteur(){
	animTourne = requestAnimationFrame( decCompteur );
	tournePiece( 1, axeActionCompteur[0], 'x', '-', 1, 0, parcoursAxeActionCompteur);
	tournePiece( 1, axeActionCompteur[1], 'x', '+', 1, 1, parcoursAxeActionCompteur);
	tourneCompteur(positionDecalage,0,'-');
	if(parcoursCompteur[0]<0 && parcoursAxeActionCompteur[0]<0 && parcoursAxeActionCompteur[1]<0){
		window.cancelAnimationFrame(animTourne);
	}
}

function initDecCompteur(){
	parcoursCompteur[0]=2*Math.PI/18;
	parcoursAxeActionCompteur[0]=Math.PI/5;
	parcoursAxeActionCompteur[1]=Math.PI/5;
	decCompteur();
	compteurPassed = true;
}

function tourneCompteur(noCompteur,i,signe){
	velocite();
	var a = tps * velocity *(20/18);
	if(signe == '+'){
		if(parcoursCompteur[i] > 0){
			compteur[noCompteur].rotation.y += a;
			parcoursCompteur[i] -= a;
		}
	}
	if(signe =='-'){
		if(parcoursCompteur[i] > 0){
			compteur[noCompteur].rotation.y -= a;
			parcoursCompteur[i] -= a;
		}
	}
}

var matRAZaccu, noDixieme;


function tourneRAZaccu(){
	var razAccuFini=true;
	translaterPiece(0.34, peigneAccu, 'z', '+', 0, parcoursPeigneAccu);
	if(noDixieme == 1){
		translaterPiece(0.34/2, peigneAccu, 'x', '+', 0, parcoursPeigneAccu);
	}
	tournePiece(1,pignonRAZAccu,'y', '+' , 2, 0, parcoursPignonAccu);
	for(var i = 0; i<accumulateur.length; i++){
		if(matRAZaccu[i][noDixieme -1]==1){
			tournePiece(1,accumulateur[i],'y','+',2,i,parcoursAccu);
		}
		else{
			parcoursAccu[i]=0;
		}
		if(parcoursAccu[i]>0){
			razAccuFini=false;
		}
	}
	if(parcoursPignonAccu[0]>0){
		razAccuFini=false;
	}
	//console.log(razAccuFini);
	return razAccuFini;
}

function rentreAuBercail(){
	translaterPiece(0.34, peigneAccu, 'z', '-', 0, parcoursPeigneAccu);
	if(noDixieme > 19){
		translaterPiece(0.34/2, peigneAccu, 'x', '-', 0, parcoursPeigneAccu);
	}
	tournePiece(1,pignonRAZAccu,'y','-',2,0,parcoursPignonAccu);
	return (parcoursPignonAccu[0]<=0) 
}

function razAccu(){
	animRAZ = requestAnimationFrame( razAccu );
	if (noDixieme == 0) {
		if(monterChariot('+')){
			soulevementChariot[0] = soulevementC ;
			matRAZaccu=matrixRAZaccu();
			initRazAccu();
			noDixieme ++ ;
		}
	}
	if (noDixieme > 0 && noDixieme <= 10) { 			
		if(tourneRAZaccu()){
			initRazAccu();
			noDixieme ++ ;
		}
	}
	if (noDixieme > 10 && noDixieme <= 20) {
		if(rentreAuBercail()){
			initRazAccu();
			noDixieme ++ ;
		}
	}
	if ((noDixieme == 21)) {
		setMovChariot (0.2) ;
		noDixieme ++ ;					
	}
	if (noDixieme == 22) { 
		if (monterChariot('-')){
			soulevementChariot[0] = soulevementC ;
			initRazAccu();
			noDixieme ++ ;			
		}		
	}
	if (noDixieme == 23) {
		positionAccu = MAT_ACC_FIN;
		if(!enCoursEx){
			toutBloquer(false);
		}
		enCours = false;
		window.cancelAnimationFrame(animRAZ);		
	}	
}

function appelRAZaccu(){
	if(!enCours){
		if(document.getElementById('normale').checked) BruitReinitTot.play();
		toutBloquer(true);
		enCours = true;
		noDixieme=0;
		setMovChariot (0.2) ;
		razAccu();
		valNumAccu = 0 ;
	}
}

function initRazAccu(){
	parcoursPeigneAccu[0] = 0.2;
	parcoursPignonAccu[0] = Math.PI/5;
	for(var i = 0; i<accumulateur.length; i++){
		parcoursAccu[i]=Math.PI/5;
	}
}

function matrixRAZaccu(){
	var mat = new Array();
	for(var i = 0; i<accumulateur.length; i++){	
		mat[i]=[];
		for(var j=0; j<10; j++){
			if(MAT_ACC_FIN[i] != 0){
				MAT_ACC_FIN[i] += 1;
				MAT_ACC_FIN[i] = MAT_ACC_FIN[i]%10;
				mat[i][j] = 1;
			}
			else { mat[i][j] = 0; }
		}
	}
	return mat;
}

var parcoursPeignecompteur = [], matRAZcompteur;

function tourneRAZcompteur(){
	var razcompteurFini=true;
	translaterPiece(0.192, peigneCompteur, 'z', '-', 0, parcoursPeignecompteur);
	if(noDixieme < 2){
		translaterPiece(0.192, peigneCompteur, 'x', '-', 0, parcoursPeignecompteur);
	}
	tournePiece(1,pignonRAZCompteur,'y','+',20/18,0,parcoursPignonCompteur);
	for(var i = 0; i<compteur.length; i++){
		if(matRAZcompteur[noDixieme-1][i]==1){
			tournePiece(1,compteur[i],'y','+',20/18,i,parcoursCompteur)
			// tourneCompteur(i,i,'+');
		}
		else{
			parcoursCompteur[i]=0;
		}
		if(parcoursCompteur[i]>0){
			razcompteurFini=false;
		}
	}
	if(parcoursPignonCompteur[0]>0){
		razcompteurFini=false;
	}
	return razcompteurFini;
}

function rentreAuBercailCompteur(){
	translaterPiece(0.192, peigneCompteur, 'z', '+', 0, parcoursPeignecompteur);
	if(noDixieme > 33){
		translaterPiece(0.192, peigneCompteur, 'x', '+', 0, parcoursPeignecompteur);
	}
	tournePiece(1,pignonRAZCompteur,'y','-',20/18,0,parcoursPignonCompteur);
	return (parcoursPignonCompteur[0] <= 0) ;
}

function razcompteur(){
	animRAZ = requestAnimationFrame( razcompteur );
	if (noDixieme == 0){
		if(monterChariot('+')){
			soulevementChariot[0] = soulevementC ;
			noDixieme ++ ;
		}
	}
	if (noDixieme >= 1 && noDixieme <= 17 ){
		if(tourneRAZcompteur()){
			initRazcompteur();
			noDixieme++;
		}		
	}
	if (noDixieme >= 18 && noDixieme <= 34){
		if(rentreAuBercailCompteur()){
			initRazcompteur();
			noDixieme++;
		}	
	}
	if (noDixieme == 35){ 
		if (monterChariot('-')){
			soulevementChariot[0] = soulevementC ;
			noDixieme ++ ;			
		}	
	}	
	if (noDixieme < 0 || noDixieme > 35){
		if(!enCoursEx){ toutBloquer(false); }
		enCours = false;
		window.cancelAnimationFrame(animRAZ);
	}
}

function appelRAZcompteur(){
	if(!enCours){
		if(document.getElementById('normale').checked) BruitReinitCnt.play();
		toutBloquer(true);
		enCours = true;
		noDixieme = 0;
		matRAZcompteur=Fonction_RAZ();
		initRazcompteur();
		razcompteur();
		valNumCompteur = 0 ;
	}
}

function initRazcompteur(){
	parcoursPeignecompteur[0] = 1;
	parcoursPignonCompteur[0] = Math.PI/9;
	for(var i = 0; i<compteur.length; i++){
		parcoursCompteur[i]=Math.PI/9;
	}
}


function tourneSysRet(sysR, t){
	if(!tourneSysRetAlle && parcoursSysRet[sysR]>0){
		tournePiece(1, sysRetenue[sysR], 'y', '-', 2, sysR, parcoursSysRet);
		if(parcoursSysRet[sysR]<=0){
			tourneSysRetAlle = true;
			parcoursSysRet[sysR]=Math.PI/18;
		}
	}
	else if(tourneSysRetAlle && parcoursSysRet[sysR]>0){
		tournePiece(1, sysRetenue[sysR], 'y', '+', 2, sysR, parcoursSysRet);
	}
}

function translateRet(sysR, t){
	if(MAT_RET[t][sysR+1] == 1 && parcoursCurseurRetenueTrans[sysR] > 0 && !finTransRet){
		translaterPiece(1, curseurRetenue[sysR+1], 'x', '-', sysR, parcoursCurseurRetenueTrans);
		if (sysR < 5) {camAntiDepas[sysR+1].position.y = positionInitialAntiDepas + 0.31 * (positionIntialcurseurRetenue  - curseurRetenue[sysR+1].position.x ) };
		if(parcoursCurseurRetenueTrans[sysR]<=0){
			parcoursCurseurRetenueTrans[sysR]=0.08;
			finTransRet = true;
		}
	}
	if(MAT_RET[t][sysR+1] == -1 && parcoursCurseurRetenueTrans[sysR] > 0 && !finTransRet){
		translaterPiece(1, curseurRetenue[sysR+1], 'x', '+', sysR, parcoursCurseurRetenueTrans);
		if (sysR < 5) {camAntiDepas[sysR+1].position.y = positionInitialAntiDepas + 0.31 * (positionIntialcurseurRetenue  - curseurRetenue[sysR+1].position.x ) };
		if(parcoursCurseurRetenueTrans[sysR]<=0){
			parcoursCurseurRetenueTrans[sysR]=0.08;
			finTransRet = true;
		}
	}

}

