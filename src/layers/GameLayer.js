class GameLayer extends Layer {

    constructor() {
        super();
        this.mensaje = new Boton(imagenes.mensaje_como_jugar, 480/2, 320/2);
        this.pausa = true;
        this.iniciar();
    }

    iniciar() {
        this.botonSalto = new Boton(imagenes.boton_salto,480*0.9,320*0.55);
        this.botonDisparo = new Boton(imagenes.boton_disparo,480*0.75,320*0.83);
        this.pad = new Pad(480*0.14,320*0.8);

        this.espacio = new Espacio(1);

        this.scrollX = 0;

        this.fondo = new Fondo(imagenes.fondo_2,480*0.5,320*0.5);

        this.bloques = [];

        this.enemigos = [];

        this.recolectables = [];

        this.fondoPuntos = new Fondo(imagenes.icono_puntos, 480*0.85,320*0.07);
        this.puntos = new Texto(0,480*0.9,320*0.09 );

        this.fondoRecolectables = new Fondo(imagenes.icono_recolectable, 480*0.1, 320*0.07);
        var n = this.recolectables.length;
        this.nRecolectables = new Texto(n, 480*0.15, 320*0.09);

        this.disparosJugador = [];

        this.cargarMapa("res/" + nivelActual + ".txt");
    }

    actualizar (){
        if (this.pausa)
            return;

        if (this.jugador.y > 320) {
            this.iniciar();
        }
        this.espacio.actualizar();
        console.log("disparosJugador: "+this.disparosJugador.length);
        // Eliminar disparos fuera de pantalla
        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                !this.disparosJugador[i].estaEnPantalla()){
                this.espacio.eliminarDinamicos(this.disparosJugador[i]);
                this.disparosJugador.splice(i, 1);
                i=i-1;
            }
        }

        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                this.disparosJugador[i].vx == 0){
                this.espacio.eliminarDinamicos(this.disparosJugador[i]);
                this.disparosJugador.splice(i, 1);
                i=i-1;
            }
        }

        this.jugador.actualizar();
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].actualizar();
        }
        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].actualizar();
        }

        // colisiones
        for (var i=0; i < this.enemigos.length; i++){
            if ( this.jugador.colisiona(this.enemigos[i])){
                if (this.enemigos[i].estado != estados.muriendo && this.enemigos[i].estado != estados.muerto) {
                    this.iniciar();
                }
            }
        }
        // colisiones , disparoJugador - Enemigo
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.enemigos.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.enemigos[j] != null &&
                    this.disparosJugador[i].colisiona(this.enemigos[j])) {
                    this.espacio.eliminarDinamicos(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                    i = i-1;
                    this.enemigos[j].impactado();
                }
            }
        }

        // Enemigos muertos fuera del juego
        for (var j=0; j < this.enemigos.length; j++){
            if ( this.enemigos[j] != null &&
                this.enemigos[j].estado == estados.muerto  ) {
                this.espacio.eliminarDinamicos(this.enemigos[j]);
                this.enemigos.splice(j, 1);
                j = j-1;
                this.puntos.valor++;
            }
        }

        // copa
        if ( this.copa.colisiona(this.jugador)){
            nivelActual++;
            if (nivelActual > nivelMax){
                nivelActual = 0;
            }
            this.pausa = true;
            this.mensaje = new Boton(imagenes.mensaje_ganar, 480/2, 320/2);
            this.iniciar();
        }

        // recolectables
        for (j=0; j < this.recolectables.length; j++){
            if ( this.recolectables[j] != null &&
                this.jugador.colisiona(this.recolectables[j]) ) {
                this.espacio.eliminarDinamicos(this.recolectables[j]);
                this.recolectables.splice(j, 1);
                j = j-1;
                this.puntos.valor *= 2;
                this.nRecolectables.valor--;
            }
        }

    }

    calcularScroll() {
        if (this.jugador.x > 480*0.3) {
            if (this.jugador.x - this.scrollX < 480*0.3) {
                this.scrollX = this.jugador.x - 480*0.3;
            }
        }
        if (this.jugador.x < this.anchoMapa - 480 * 0.3) {
            if (this.jugador.x - this.scrollX > 480*0.7) {
                this.scrollX = this.jugador.x - 480*0.7;
            }
        }
    }

    dibujar (){
        this.fondo.dibujar();
        this.calcularScroll();
        for (let i=0; i < this.bloques.length; i++) {
            this.bloques[i].dibujar(this.scrollX);
        }
        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].dibujar(this.scrollX);
        }
        this.copa.dibujar(this.scrollX);
        this.jugador.dibujar(this.scrollX);
        for (i=0; i < this.recolectables.length; i++) {
            this.recolectables[i].dibujar(this.scrollX);
        }
        this.fondoPuntos.dibujar();
        this.puntos.dibujar();
        this.fondoRecolectables.dibujar();
        this.nRecolectables.dibujar();
        if (!this.pausa && entrada == entradas.pulsaciones) {
            this.botonDisparo.dibujar();
            this.botonSalto.dibujar();
            this.pad.dibujar();
        }

        if ( this.pausa ) {
            this.mensaje.dibujar();
        }
    }


    procesarControles( ){
        // pausa
        if(controles.continuar){
            controles.continuar = true;
            this.pausa = false;
        }

        // disparar
        if (  controles.disparo ){
            var nuevoDisparo = this.jugador.disparar();
            if ( nuevoDisparo != null ) {
                this.disparosJugador.push(nuevoDisparo);
                this.espacio.agregarDinamicos(nuevoDisparo);
            }


        }

        // Eje X
        if ( controles.moverX > 0 ){
            this.jugador.moverX(1);

        }else if ( controles.moverX < 0){
            this.jugador.moverX(-1);

        } else {
            this.jugador.moverX(0);
        }

        // Eje Y
        if ( controles.moverY > 0 ) {
            this.jugador.saltar();
        }

    }

    cargarMapa(ruta) {
        var fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);

        fichero.onreadystatechange = function () {
            let texto = fichero.responseText;
            let lineas = texto.split("\n");
            this.anchoMapa = (lineas[0].length - 1) * 40
            for (let i = 0; i < lineas.length; i++) {
                let l = lineas[i];
                for (let j = 0; j < l.length; j++) {
                    let s = l[j];
                    let x = 40/2 + j*40;
                    let y = 32 + i*32;
                    this.cargarObjetoMapa(s, x, y);
                }
            }
        }.bind(this);

        fichero.send();
    }

    cargarObjetoMapa(simbolo, x, y) {
        switch (simbolo) {
            case "#":
                const bloque = new Bloque(imagenes.bloque_tierra, x, y);
                bloque.y = bloque.y - bloque.alto/2;
                this.bloques.push(bloque);
                this.espacio.agregarEstaticos(bloque);
                break;
            case "1":
                this.jugador = new Jugador(x, y);
                this.jugador.y = this.jugador.y - this.jugador.alto / 2;
                this.espacio.agregarDinamicos(this.jugador);
                break;
            case "E":
                const enemigo = new Enemigo(x, y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                this.enemigos.push(enemigo);
                this.espacio.agregarDinamicos(enemigo);
                break;
            case "C":
                this.copa = new Copa(x, y);
                this.copa.y = this.copa.y - this.copa.alto/2;
                this.espacio.agregarDinamicos(this.copa);
                break;
            case "R":
                const recolectable = new Recolectable(x, y);
                recolectable.y = recolectable.y - recolectable.alto/2;
                this.recolectables.push(recolectable);
                this.nRecolectables.valor++;
                this.espacio.agregarDinamicos(recolectable);
                break;
        }
    }

    calcularPulsaciones(pulsaciones){
        // Suponemos botones no estan pulsados
        this.botonDisparo.pulsado = false;
        this.botonSalto.pulsado = false;
        controles.moverX = 0;
        controles.continuar = false;

        for(var i=0; i < pulsaciones.length; i++){
            if(pulsaciones[i].tipo == tipoPulsacion.inicio){
                controles.continuar = true;
            }

            if (this.pad.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                var orientacionX = this.pad.obtenerOrientacionX(pulsaciones[i].x);
                if ( orientacionX > 20) { // de 0 a 20 no contabilizamos
                    controles.moverX = orientacionX;
                }
                if ( orientacionX < -20) { // de -20 a 0 no contabilizamos
                    controles.moverX = orientacionX;
                }
            }

            if (this.botonDisparo.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                this.botonDisparo.pulsado = true;
                if ( pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.disparo = true;
                }
            }

            if (this.botonSalto.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                this.botonSalto.pulsado = true;
                if ( pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.moverY = 1;
                }
            }

        }

        // No pulsado - Boton Disparo
        if ( !this.botonDisparo.pulsado ){
            controles.disparo = false;
        }

        // No pulsado - Boton Salto
        if ( !this.botonSalto.pulsado ){
            controles.moverY = 0;
        }
    }

}
