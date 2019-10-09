class Jugador extends Modelo {

    constructor(x, y) {
        super(imagenes.jugador , x, y)
        this.vx = 0; // velocidadX
        this.vy = 0; // velocidadY
        this.orientacion = orientaciones.derecha;
        this.estado = estados.moviendo;

        // Animaciones
        this.aIdleDerecha = new Animacion(imagenes.jugador_idle_derecha,
            this.ancho, this.alto, 6, 8);
        this.aIdleIzquierda = new Animacion(imagenes.jugador_idle_izquierda,
            this.ancho, this.alto, 6, 8);
        this.aCorriendoDerecha = new Animacion(imagenes.jugador_corriendo_derecha,
            this.ancho, this.alto, 6, 8);
        this.aCorriendoIzquierda = new Animacion(imagenes.jugador_corriendo_izquierda,
            this.ancho, this.alto, 6, 8);
        this.aDispararDerecha = new Animacion(imagenes.jugador_disparando_derecha,
            this.ancho, this.alto, 6, 4, this.finAnimacionDisparar.bind(this));
        this.aDispararIzquierda = new Animacion(imagenes.jugador_disparando_izquierda,
            this.ancho, this.alto, 6, 4, this.finAnimacionDisparar.bind(this));
        this.aSaltandoDerecha = new Animacion(imagenes.jugador_saltando_derecha,
            this.ancho, this.alto, 6, 4);
        this.aSaltandoIzquierda = new Animacion( imagenes.jugador_saltando_izquierda,
            this.ancho, this.alto, 6, 4);
        this.animacion = this.aIdleDerecha;

        // Disparo
        this.cadenciaDisparo = 10;
        this.tiempoDisparo = 0;

    }

    actualizar(){
        this.animacion.actualizar();

        if (this.choqueAbajo) {
            this.enElAire = false;
        }
        else {
            this.enElAire = true;
        }

        if (this.enElAire && this.estado == estados.moviendo ){
            this.estado = estados.saltando;
        }
        if (!this.enElAire && this.estado == estados.saltando ){
            this.estado = estados.moviendo;
        }
        // Tiempo Disparo
        if ( this.tiempoDisparo > 0 ) {
            this.tiempoDisparo--;
        }

        if (this.vx > 0) {
            this.orientacion = orientaciones.derecha;
        }

        if (this.vx < 0) {
            this.orientacion = orientaciones.izquierda;
        }

        switch(this.estado) {
            case estados.disparando:
                if (this.orientacion == orientaciones.derecha)
                    this.animacion = this.aDispararDerecha;
                if (this.orientacion == orientaciones.izquierda)
                    this.animacion = this.aDispararIzquierda;
                break;
            case estados.moviendo:
                if (this.vx != 0) {
                    if (this.orientacion == orientaciones.derecha)
                        this.animacion = this.aCorriendoDerecha;
                    if (this.orientacion == orientaciones.izquierda)
                        this.animacion = this.aCorriendoIzquierda;
                }

                if (this.vx == 0) {
                    if (this.orientacion == orientaciones.derecha)
                        this.animacion = this.aIdleDerecha;
                    if (this.orientacion == orientaciones.izquierda)
                        this.animacion = this.aIdleIzquierda;
                }
                break;
            case estados.saltando:
                if (this.orientacion == orientaciones.derecha){
                    this.animacion = this.aSaltandoDerecha;
                }
                if (this.orientacion == orientaciones.izquierda){
                    this.animacion = this.aSaltandoIzquierda;
                }
                break;
        }
    }

    dibujar (scrollX = 0){
        this.animacion.dibujar(this.x - scrollX, this.y);
    }


    moverX (direccion){
        this.vx = direccion * 3;
    }

    moverY (direccion){
        this.vy = direccion * 3;
    }

    disparar(){

        if ( this.tiempoDisparo == 0) {
            this.estado = estados.disparando;
            // reiniciar Cadencia
            this.tiempoDisparo = this.cadenciaDisparo;
            const disparo = new DisparoJugador(this.x, this.y);
            if (this.orientacion == orientaciones.izquierda)
                disparo.vx = disparo.vx * -1;
            return disparo;
        } else {
            return null;
        }

    }

    finAnimacionDisparar() {
        this.estado = estados.moviendo;
    }

    saltar() {
        if(!this.enElAire) {
            this.vy = -16;
            this.enElAire = true;
        }
    }

}
