class Puerta extends Modelo {

    pareja = null;

    constructor(x, y, id) {
        super(imagenes.icono_portal, x, y);
        this.idPuerta = id;
    }

    emparejar(puerta) {
        this.pareja = puerta;
        puerta.pareja = this;
    }

    desemparejar() {
        this.pareja = null;
    }
}