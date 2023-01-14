import express from "express";
import {ProductManager} from "../dao/managers/ProductManager.js";
import { productsModel } from "../dao/models/products.model.js";

const router = express.Router();
const productManager = new ProductManager("./src/db/products.json");

router.get('/', async (req, res) => { 
    //.lean() al final porque por defecto handlebars no deja acceder por temas de seguridad
    const products = await productsModel.find().lean();
    if (!products) {
        res.send({ status: "succes", products: "No hay productos"})
    }
    res.render('home', {products})
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

router.get('/chat', (req, res) => {
    res.render('chat');
});


export default router