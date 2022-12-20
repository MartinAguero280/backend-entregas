import express from "express";
import {ProductManager} from "../Managers/ProductManager.js";

const router = express.Router();
const productManager = new ProductManager("./src/db/products.json");

router.get('/', async (req, res) => { 
    const products = await productManager.getProducts();
    res.render('home', {products: products})
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
})

export default router