import express from "express";
import fs from "fs";
import {ProductManager} from "./Managers/ProductManager.js";
import { CartsManager } from "./Managers/CartManager.js";

const productManager = new ProductManager("./src/db/products.json");
const cartsManager = new CartsManager("./src/db/carts.json")

const app = express();
app.use(express.json())
app.use( express.urlencoded({ectended: true}))

const port = 8080;


//Products

app.get("/api/products", async (req, res) => {

    try {
        const allProducts = await productManager.getProducts();

        const {limit} = req.query
        if (!limit || limit < 1) {
            return res.send({ products: allProducts});
        }

        const products = allProducts.slice(0, limit)

        res.send({ products })
    } catch (error) {
        console.log("Error al traer los productos");
    }
});

app.get("/api/products/:id", async (req, res) => {
    try {
        const {id: paramId} = req.params;
        const id = Number(paramId);

        if (id < 0) {
            return res.send({error: "El id tiene que ser un número válido"})
        };

        const product = await productManager.getProductById(id);

        if (!product) {
            return res.send({status: "error", error: "El producto no fue encontrado"})
        };

        res.send({product})

    } catch (error) {
        
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        if (!newProduct) {
            return res.status(400).send({status: "error", error: "Valores incompletos"})
        }
        res.send({status: "succes"})

    } catch (error) {
        console.log(error);
    }
});

app.put("/api/products/:id", async (req, res) => {
    try {
        const {id: paramId} = req.params;
        const id = Number(paramId);

        const productUpdated = await productManager.updateProduct(id, req.body.campo, req.body.value);

        if (!productUpdated) {
            return res.status(400).send({status: "error", error: "Error al actualizar un producto"})
        }
        res.send({status: "succes", productUpdated})

    } catch (error) {
        console.log(error);
    }
});

app.delete("/api/products/:id", async (req, res) => {
    try {
        const {id: paramId} = req.params;
        const id = Number(paramId);

        const allProducts = await productManager.getProducts();
        const idProductsBoolean = allProducts.some( producto => producto.id === id);

        if (!idProductsBoolean) {
            return res.status(400).send({status: "error", error: "Error al eliminar un producto, el id que a introducido no coincide con ningun producto"})
        };

        const productDeleted = await productManager.deleteProduct(id);

        res.send({status: "succes"})

    } catch (error) {
        console.log(error);
    }
});



//Cart

app.post("/api/carts", async (req, res) => {
    const newCart = await cartsManager.addCart();
    if (!newCart) {
        return res.status(400).send({status: "error", error: "No se a podido agregar el carrito"})
    }
    res.send({status: "succes"})
})

app.get("/api/carts/:id", async (req, res) => {
    try {
        const {id: paramId} = req.params;
        const id = Number(paramId);

        if (id < 1) {
            return res.send({error: "El id tiene que ser un número válido"})
        };

        const cart = await cartsManager.getCartById(id);

        if (!cart) {
            return res.send({error: "El carrito no fue encontrado"})
        };

        res.send({cart})

    } catch (error) {
        console.log(error);
    }
});

app.post("/api/carts/:idc/product/:idp", async (req, res) => {
    try {

        const idc = Number(req.params.idc);
        const idp = Number(req.params.idp);

        if (idc < 0 || idp < 0) {
            return res.send({error: "Los id tienen que ser un número válido"})
        };

        const cartById = await cartsManager.getCartById(idc);
        const productById = await productManager.getProductById(idp);

        if (!cartById || !productById) {
            return res.send({error: "El producto no fue encontrado"})
        };

        const carts = await cartsManager.getCarts();
        const newCart = await carts.filter(cart => cart.id !== idc);


        const isInCartBoolean = cartById.products.some(product => product.id === idp);
        if (isInCartBoolean) {

            const productId = cartById.products.find(product => product.id === idp);
            productId.quantity = productId.quantity + 1;
            const newProductsNoId = cartById.products.filter(product => product.id !== idp);

            cartById.products = newProductsNoId;
            cartById.products.push(productId);

            newCart.push(cartById);
            await fs.promises.writeFile(cartsManager.path, JSON.stringify(newCart, null, 3));
            return res.send({status: "succes", cartById})
        }

        productById.quantity = 1;
        cartById.products.push({id: productById.id, quantity: productById.quantity})

        newCart.push(cartById);
        await fs.promises.writeFile(cartsManager.path, JSON.stringify(newCart, null, 3));

        res.send({status: "succes", cartById})


    } catch (error) {
        console.log(error);
    }
});


app.listen(port, () => console.log(`server running on port ${port}`))
