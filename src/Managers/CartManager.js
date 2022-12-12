import fs from "fs";

export class CartsManager {

    constructor() {
        this.path = "./src/db/carts.json";
        this.init();
    };

    init() {
        try {
            const existFile = fs.existsSync(this.path);
            if (existFile) return;

            fs.writeFileSync(this.path, JSON.stringify([]));
        } catch (error) {
            console.log(error);
        }
    };

    getCarts = async () => {
        try {
            const response = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(response);
        } catch (error) {
            console.log("Error al buscar los productos");
        }
    }

    addCart = async () => {

        const cart = {
            products: [
                
            ],
        }

        const carts = await this.getCarts();

        cart.id = !carts.length ?
            1 :
            carts[carts.length - 1].id + 1;

        carts.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 3));

        return carts;
    }

    getCartById = async (id) => {
        try {
            const response = await fs.promises.readFile(this.path, "utf-8");
            const jsonResponse = await JSON.parse(response);
            const cartById = await jsonResponse.find(cart => cart.id === id);

            
            if (cartById) {
                return cartById
            } else {
                console.log(`Not found (No hay carrito que coincida con el id: ${id})`)
            }  
        
        } catch (error) {
            console.log("Error al buscar un carrito según su id");
        }
    }

};

