import { inputCadr, aiguilles, renderer, scene, camera, fantAiguilles } from './initScene.js'
import { affichCadran } from './affichageBouton.js'
var nbanimationsRZaig = 90;
var animeReturnZ;


/**
 * faire passer les valeurs entre offset et offset + 2*Math.PI pour l'animation
 */
function aiguillesNormal(aiguilles) {
    for (let i = 0; i < 4; i++) {
        console.log(aiguilles[i].rotation.x)
            // met les valeurs entre offset et offset + 2*Math.PI
        if (aiguilles[i].rotation.x > Math.PI / 2 + 2 * Math.PI) {
            while (aiguilles[i].rotation.x > Math.PI / 2 + Math.PI * 2) {
                aiguilles[i].rotation.x -= 2 * Math.PI
            }
        }
        if (aiguilles[i].rotation.x < Math.PI / 2) {
            while (aiguilles[i].rotation.x < Math.PI / 2) {
                aiguilles[i].rotation.x += 2 * Math.PI
            }
        }
        console.log(aiguilles[i].rotation.x)

    }
}

function razAiguilles() {
    aiguillesNormal(aiguilles)
    animeRazAig();
    for (let i = 0; i < 4; i++) {
        fantAiguilles[i] = Math.PI / 2;
        inputCadr[i] = 0;
    }
    affichCadran(inputCadr);
}

/**
 * change de 90 a 0 tout les 10 frames
 */
function animeRazAig() {
    nbanimationsRZaig--;
    // console.log(nbanimationsRZaig)
    animeReturnZ = requestAnimationFrame(animeRazAig)
    if (nbanimationsRZaig % 10 == 0) {
        for (let i = 0; i <= 3; i++) {
            console.log(aiguilles[i].rotation.x)

            // cas tourner sens horaire
            if (aiguilles[i].rotation.x < 3 * Math.PI / 2) {
                if (aiguilles[i].rotation.x > Math.PI / 2 + Math.PI / 9) {
                    aiguilles[i].rotation.x -= Math.PI / 9;
                } else {
                    aiguilles[i].rotation.x = Math.PI / 2
                }

            }
            // cas tourner sens antihoraire 
            else {
                if (aiguilles[i].rotation.x > Math.PI / 2 + 2 * Math.PI - Math.PI / 9) {
                    aiguilles[i].rotation.x = Math.PI / 2
                } else {
                    aiguilles[i].rotation.x += Math.PI / 9;
                }
            }
        }

    }

    renderer.render(scene, camera);
    if (nbanimationsRZaig == 0) {
        nbanimationsRZaig = 90;
        console.log("fini")
        window.cancelAnimationFrame(animeReturnZ);
    }
}

export { aiguillesNormal, razAiguilles }