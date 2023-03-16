import fs from "fs";

export class ProductManager {

    constructor(path) {
        this.path = path;
        this.init();
    }

    init() {
        try {
            const existFile = fs.existsSync(this.path);
            if (existFile) return;

            fs.writeFileSync(this.path, JSON.stringify([]));
        } catch (error) {
            console.log(error);
        }
    }

    find = async () => {
        try {
            const response = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(response);
        } catch (error) {
            console.log("Error al buscar los productos");
        }
    }

    findById = async (id) => {
        try {
            const response = await fs.promises.readFile(this.path, "utf-8");
            const jsonResponse = await JSON.parse(response);
            const productById = await jsonResponse.find(producto => producto.id == id);

            
            if (productById) {
                return productById
            } else {
                console.log(`Not found (No hay producto que coincida con el id: ${id})`)
            }  
        
        } catch (error) {
            console.log("Error al buscar un producto según su id");
        }
    }

    create = async ({title, description, price, stock, category}) => {
        try {

            const response = await fs.promises.readFile(this.path, "utf-8");
            const jsonResponse = await JSON.parse(response);
            const IsInProductsBolean = await jsonResponse.some(producto => producto.code == code);

            if (!title || !description || !price || !stock || !category) {
                return console.log("Las variables son obligatorias");
            } else if (IsInProductsBolean === true) {
                return console.log("No se pueden repetir los productos")
            };

            const product = {
                title,
                description,
                price,
                stock,
                category
            }

            const products = await this.getProducts();

            product.id = !products.length ? 1 : products[products.length - 1].id + 1;

            products.push(product);

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 3));

            return product;

        } catch (error) {
            console.log("Error al añadir un producto");
        }
    }

    update = async (id, campo, value) => {
        try {

            const response = await fs.promises.readFile(this.path, "utf-8");
            const newPath = await JSON.parse(response);
            const productByIdBolean = await newPath.some( (producto) => producto.id === id);
            const productsById = await newPath.filter( (producto) => producto.id !== id);

            if (productByIdBolean) {
                const productById = await newPath.filter( (producto) => producto.id === id);
                productById[0][campo] = value;
                productsById.push(productById[0]); 
                await fs.promises.writeFile(this.path, JSON.stringify(productsById, null, 3));
                console.log(`El producto con el id: ${id} se a actualizado exitosamente`);
                return productById
            }
            

        } catch (error) {
            console.log("Error al actualizar un producto");
        }
    }

    delete = async (id) => {
        try {
            const response = await fs.promises.readFile(this.path, "utf-8");
            const newPath = await JSON.parse(response);
            const productById = await newPath.some( (producto) => producto.id === id);
            

            if (productById) {
                const productsById = await newPath.filter( (producto) => producto.id !== id);
                await fs.promises.writeFile(this.path, JSON.stringify(productsById, null, 3));
                console.log(`El producto con el id: ${id} se a eliminado exitosamente`);
            } else console.log(`El id: ${id} no coincide con ningun producto`);
            
            
        } catch (error) {
            console.log("Error al eliminar producto")
        }
    }

}
