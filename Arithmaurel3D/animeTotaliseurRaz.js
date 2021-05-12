import { cadrans, angleInitCadrans, ecrouCentre, renderer, scene, camera } from './initScene.js'
import { BruitBouton } from './sound.js'
var nbanimationsRZ = 80;
var seuil = 5;
var animeReturnZero;

function razTotaliseur() {
    cadransNormal()
    BruitBouton.play()
    animeRazTot();
    console.log('RAZ produit');

}

function calculSeuil(seuil) {
    console.log(seuil)
    for (let i = 0; i < 8; i++) {
        // si le cadran <= 5
        if (cadrans[i].rotation.x)
        // si le cadran > 5
            cadrans[i].rotation.x -= Math.PI / 10;
        if (cadrans[i].rotation.x < angleInitCadrans[i]) {
            cadrans[i].rotation.x = angleInitCadrans[i];
        }
    }
}
/**
 * faire passer les valeurs entre offset et offset + 2*Math.PI pour l'animation
 * un pas correspond à Math.PI/9
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
 *  6 seuils pour le bouton central
 *  si <= 5, passe à 5, 4, 3, 2, 1, 0
 *  4.999
 * si > 5 passe à 5, 6, 7, 8, 9, 10
 * 5.01
 */
function animeRazTot() {
    nbanimationsRZ--
    animeReturnZero = requestAnimationFrame(animeRazTot);
    // partie gauche-droite passe de 80 a 40, seuil pour les frames 74, 68, 62, 56, 50, 44
    if (nbanimationsRZ >= 40) {
        ecrouCentre.rotation.x -= Math.PI / 100;
        if (nbanimationsRZ % 6 == 2) {
            calculSeuil(seuil)
            seuil--
        }
        for (let i = 0; i < 8; i++) {
            cadrans[i].rotation.x -= Math.PI / 10;
            if (cadrans[i].rotation.x < angleInitCadrans[i]) {
                cadrans[i].rotation.x = angleInitCadrans[i];
            }
        }
    }
    // partie droite gauche passe de 40 a 0
    else {
        ecrouCentre.rotation.x += Math.PI / 100;
    }
    // objectParent.parent.rotation.x -= Math.PI/50;

    renderer.render(scene, camera);

    if (nbanimationsRZ == 0) {
        console.log("fini")
        nbanimationsRZ = 80;
        seuil = 5;
        window.cancelAnimationFrame(animeReturnZero);
        BruitBouton.pause()
        BruitBouton.currentTime = 0
    }
}

export { cadransNormal, razTotaliseur }