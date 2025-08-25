
class carrito{
    constructor({id, productos = []}){
        this.id = id;
        this.productos = productos;
    }
}

module.exports = carrito;