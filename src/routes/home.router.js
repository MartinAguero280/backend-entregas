import express from "express";
import {ProductManager} from "../Managers/ProductManager.js";
import { productsModel } from "../models/products.model.js";

const router = express.Router();
const productManager = new ProductManager("./src/db/products.json");

router.get('/', async (req, res) => { 
    const products = await productsModel.find();
    if (!products) {
        res.send({ status: "succes", products: "No hay productos"})
    }
    res.render('home', {products: products})
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

router.get('/chat', (req, res) => {
    res.render('chat');
});



//FileSystem
/*router.get('/', async (req, res) => { 
    const products = await productManager.getProducts();
    res.render('home', {products: products})
});
*/

export default router