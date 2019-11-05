class BloqueMovil extends Bloque {

    constructor(x, y) {
        super(imagenes.bloque_fondo_muro, x, y);

        this.vx = 1;
    }

    actualizar() {
        this.vx = 2;
    }

}