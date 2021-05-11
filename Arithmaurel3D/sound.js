var BruitBouton = new Audio('sounds/Calculateur_mecanique.mp3');
BruitBouton.preload = 'auto';
BruitBouton.loop = false;
BruitBouton.addEventListener('ended', function(e) { BruitBouton.currentTime = 0.2 }, false);
export { BruitBouton }