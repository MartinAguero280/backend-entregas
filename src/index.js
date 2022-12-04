import express from "express";
import {ProductManager} from "./Managers/ProductManager.js";
const productManager = new ProductManager("./src/db/products.json");

const app = express();
const port = 8080;

app.get("/products", async (req, res) => {

    try {
        const allProducts = await productManager.getProducts();

        const {limit} = req.query
        if (!limit || limit < 1) {
            return res.send({ products: allProducts});
        }

        const products = allProducts.slice(0, limit)

        res.send({ products })
    } catch (error) {
        console.log(error);
    }

});

app.get("/products/:id", async (req, res) => {
    try {
        const {id: paramId} = req.params;
        const id = Number(paramId);

        if (id < 0) {
            return res.send({error: "El id tiene que ser un número válido"})
        };

        const product = await productManager.getProductById(id);

        if (!product) {
            return res.send({error: "El producto no fue encontrado"})
        };

        res.send({product})

    } catch (error) {
        
    }
})

app.listen(port, () => console.log(`server running on port ${port}`))
