let nivelActual = 0;
let nivelMax = 3;

let pulsaciones = []; // actuales registradas

let tipoPulsacion = {}; // tipos
tipoPulsacion.inicio = 1;
tipoPulsacion.mantener = 2;

let entradas = {}; // tipos
entradas.pulsaciones = 1;
entradas.teclado = 2;
entradas.gamepad = 3;
let entrada = entradas.pulsaciones;


const estados = {
    moviendo: 2,
    saltando: 3,
    muriendo: 4,
    muerto: 5,
    disparando: 6,
    impactado: 7,
}

const orientaciones = {
    derecha: 2,
    izquierda: 3,
}