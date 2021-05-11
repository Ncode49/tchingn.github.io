import { scene, camera } from './initScene.js'
var pasChange;
var animvueChangeProg;
var dPosX, dPosY, dPosZ, dUpX, dUpY, dUpZ;

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

export { faceDessus, faceVue }