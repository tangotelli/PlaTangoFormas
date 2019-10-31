class Recolectable extends Modelo {

    constructor(x, y) {
        super(imagenes.icono_recolectable, x, y);

        this.aRecolectable = new Animacion(imagenes.recolectable, this.ancho, this.alto, 6, 8);
        this.animacion = this.aRecolectable;
    }

    actualizar() {
        this.animacion.actualizar();
    }

    dibujar(scrollX = 0) {
        this.animacion.dibujar(this.x - scrollX, this.y);
    }

}