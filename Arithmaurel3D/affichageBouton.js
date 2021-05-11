/**
 * Affiche valeur du cadran a l'ecran
 * @param {int[]} inputCadr 
 */

function affichCadran(inputCadr) {
    document.getElementById('cadran').innerHTML = '&nbsp;';
    for (let i = 3; i >= 0; i--) {
        document.getElementById('cadran').innerHTML += (Number.isInteger(inputCadr[i]) ? inputCadr[i] : inputCadr[i].toFixed(2)) + '&nbsp;'
    }
}

export { affichCadran }