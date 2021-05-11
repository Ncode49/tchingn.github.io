import { cadrans, angleInitCadrans, ecrouCentre, renderer, scene, camera } from './initScene.js'
import { BruitBouton } from './sound.js'
var nbanimationsRZ = 80;
var animeReturnZero;

function razTotaliseur() {
    cadransNormal()
    BruitBouton.play()
    animeRazTot();
    console.log('RAZ produit');

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
    }
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

        window.cancelAnimationFrame(animeReturnZero);
        BruitBouton.pause()
        BruitBouton.currentTime = 0
    }
}

export { cadransNormal, razTotaliseur }