// Express
import express from "express";
// Model
import { productModel } from "../dao/mongo/models/product.model.js";
// Require role
import { requireRole } from "../utils.js";
// Product controller
import ProductController from "../controllers/product.controller.js";
// Custom Errors
import CustomError from "../services/errors/custom_errors.js";
import EErrors from "../services/errors/enums.js";
import { createProductInfo } from "../services/errors/info.js";


const router = express.Router();
const Product = new ProductController();

// Products

// Api products
router.get("/api/products", requireRole('user', 'premium'), async (req, res) => {
    try {
        const product = await Product.find();

        res.status(200).send({status: "success", product})

    } catch (error) {
        res.status(500).send({status: "error", error: "No hay productos"})
    }
});

// View Products
router.get("/products", requireRole('user', 'premium'), async (req, res) => {

    try {

        const result = await Product.productsPaginate(req, res);

        return res.status(200).render('products/products', result)

    } catch (error) { 
        return res.status(500).send({status: 'error', error: 'Error al traer los productos'});
    }
});

// Manage Products
router.get("/products/manage", requireRole('premium'), async (req, res) => {

    try {

        const result = await Product.productsPaginate(req, res);

        return res.status(200).render('products/manageProducts', result)

    } catch (error) { 
        return res.status(500).send({status: 'error', error: 'Error al traer los productos'});
    }
});

// View create Product
router.get("/products/create", requireRole('premium'), async(req, res) => {
    res.render('products/createProducts');
});

// Create Product
router.post("/products/create", requireRole('premium'), async(req, res) => {
    try {

    const newProduct = req.body;
    const { title, description, price, stock, category } = req.body;

    if (!title || !description || !price || !stock || !category) {
        return CustomError.createError({
            name: "Product creation error",
            cause: createProductInfo({title, description, price, stock, category}),
            message: "Error trying to create product",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }

    
    if (req.user.user.role === 'premium') {
        newProduct.owner = req.user.user.email;
        const result = await Product.create(newProduct);

        return res.redirect('/products');
    }

    const result = await Product.create(newProduct);

    return res.status(200).redirect('/products');

    } catch (error) { 
        res.status(500).res({status: 'error', error: 'Error al crear el producto'})
    }
})

// Mostrar un producto segun su id
router.get("/api/products/:id", requireRole('user', 'premium'), async (req, res) => {
    try {
        const {id} = req.params;

        if (id < 0) {
            return res.send({error: "El id tiene que ser un número válido"})
        }; 

        const product = await Product.find({_id: id});

        return res.status(200).send({status: "success", product})

    } catch (error) {
        return res.status(404).send({status: "error", error: "El producto no fue encontrado"})
    }
});

// Agregar un nuevo producto
router.post("/api/products", requireRole('premium'), async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        if (!newProduct) {
            return res.status(400).send({status: "error", error: "Valores incompletos"})
        }

        return res.status(200).send({status: "success"})

    } catch (error) {
        return res.status(500).send({status: "error", error: "Error al agregar el producto"})
    }
});

// Actualizar un producto segun su id
router.put("/api/products/:id", requireRole('admin'), async (req, res) => {
    try {
        const {id} = req.params;

        const elementUpdated = req.body;
        const result = await Product.updateOne({_id: id}, elementUpdated);

        if (elementUpdated.length === undefined) {
            return res.status(400).send({status: "error", error: "Error al actualizar un producto"})
        }
        res.status(200).send({status: "success", result, product: elementUpdated})

    } catch (error) {
        return res.status(400).send({status: "error", error: "Error al actualizar un producto"})
    }
});

// Eliminar un producto segund su id
router.delete("/api/products/:id", requireRole('premium'), async (req, res) => {

    try {

        const {id} = req.params;
        const productOwner = req.query.productOwner;

        if (req.user.user.role !== 'admin') {
            if (req.user.user.email !== productOwner) {
                return res.status(500).send({status: 'error', error: 'No puede eliminar un producto que no ha creado'})
            }
        }
        const product = await Product.findOne({_id: id});
        
        const productDeleted = await Product.deleteOne({_id: id});

        if (productOwner !== 'admin') {
            const emailDeleteProduct = await Product.emailDeleteProduct(product)
        }

        return res.status(200).send({status: "success", productDeleted: productDeleted})

    } catch (error) {
        return res.status(500).send({status: "error", error: "Error al eliminar un producto"})
    }

});

export default router