import { cadrans, angleInitCadrans, ecrouCentre, renderer, scene, camera } from './initScene.js'
import { BruitBouton } from './sound.js'
var nbanimationsRZ = 160;
var animeReturnZero;

function razTotaliseur() {
    cadransNormal()
    BruitBouton.play()
    animeRazTot();
    console.log('RAZ produit');

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
    if (nbanimationsRZ >= 80) {
        ecrouCentre.rotation.x -= Math.PI / 200;
        majPosCadran()
    }
    // partie droite gauche passe de 40 a 0
    else {
        ecrouCentre.rotation.x += Math.PI / 200;
    }
    // objectParent.parent.rotation.x -= Math.PI/50;

    renderer.render(scene, camera);

    if (nbanimationsRZ == 0) {
        console.log("fini")
        nbanimationsRZ = 160;
        window.cancelAnimationFrame(animeReturnZero);
        BruitBouton.pause()
        BruitBouton.currentTime = 0
    }
}


// seuil prend la valeur 5, 4, 3, 2, 1, 0 en fonction de la zone
// pas negatif => sens decroissant
// pas positid => sens croissant
// seuil a 1 passe de 5.01 a 6 ou 4.99 a 4
// passe de mainiere discrete 
function razCadr(seuil) {
    // entre 5 et 6
    for (let i = 0; i < 8; i++) {
        if ((cadrans[i].rotation.x > (2 * Math.PI / 10) * (seuil - 1) + angleInitCadrans[i]) &&
            (cadrans[i].rotation.x <= (2 * Math.PI / 10) * seuil + angleInitCadrans[i])) {
            console.log("entre " + (seuil - 1) + " et " + (seuil) + " on met a " + (seuil - 1))
            cadrans[i].rotation.x = (2 * Math.PI / 10) * (seuil - 1) + angleInitCadrans[i]
        } else if ((cadrans[i].rotation.x >= (2 * Math.PI / 10) * (10 - seuil) + angleInitCadrans[i]) &&
            (cadrans[i].rotation.x < (2 * Math.PI / 10) * (10 - seuil + 1) + angleInitCadrans[i])) {
            console.log("entre " + (10 - seuil) + " et " + (10 - seuil + 1) + " on met a " + (10 - seuil + 1))
            cadrans[i].rotation.x = (2 * Math.PI / 10) * (10 - seuil + 1) + angleInitCadrans[i]
        }
    }

    // console.log((cadrans[0].rotation.x - angleInitCadrans[0]) * 180 / Math.PI)

}

function majPosCadran() {
    if (ecrouCentre.rotation.x * 180 / Math.PI > 203) {
        console.log("sup 203")
    } else if (ecrouCentre.rotation.x * 180 / Math.PI > 190) {
        console.log("zone a 5")
        razCadr(5)
    } else if (ecrouCentre.rotation.x * 180 / Math.PI > 177) {
        console.log("zone a 4")
        razCadr(4)
    } else if (ecrouCentre.rotation.x * 180 / Math.PI > 164) {
        console.log("zone a 3")
        razCadr(3)
    } else if (ecrouCentre.rotation.x * 180 / Math.PI > 151) {
        razCadr(2)
        console.log("zone a 2")
    } else if (ecrouCentre.rotation.x * 180 / Math.PI > 139) {
        razCadr(1)
        console.log("zone a 1")
    }
}
export { cadransNormal, razTotaliseur, majPosCadran }