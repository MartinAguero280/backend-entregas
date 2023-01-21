import express from "express";
import { productsModel } from "../dao/models/products.model.js";

const router = express.Router();

// Products

// Api products
router.get("/api/products", async (req, res) => {
    try {
        const product = await productsModel.find();

        res.send({status: "succes", product})

    } catch (error) {
        res.send({status: "error", error: "No hay productos"})
    }
});

// Mostrar view con todos los productos
router.get("/products", async (req, res) => {

    try {

        const page = req.query?.page || 1;
        const limit = req.query?.limit || 10;
        const filter = req.query?.query || "";
        const sort = req.query?.sort || "";
        const search = {};
        const options = {page, limit, lean: true};

        if (filter) {
            search["$or"] = [
                {category: {$regex: filter}},
                {title: {$regex: filter}},
            ]
        }

        if (sort) {
            if (sort == "asc") {
                const result = await productsModel.paginate({}, { sort:{ price: 1 } });
                return res.send({ result })
            }else if (sort == "desc") {
                const result = await productsModel.paginate({}, { sort:{ price: 1 } });
                return res.send({ result })
            }
        };

        const result = await productsModel.paginate(search, options);

        if (!result) {
            res.send({ status: "succes", products: "No hay productos"})
        }

        result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&query=${filter}&sort=${sort}` : "";
        result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&query=${filter}&sort=${sort}` : "";
        result.isValid = !(page <= 0 || page > result.totalPages || isNaN(page));

        res.render('products', result)

    } catch (error) {
        console.log("Error al traer los productos");
    }
});

// Mostrar un producto segun su id
router.get("/api/products/:id", async (req, res) => {
    try {
        const {id} = req.params;

        if (id < 0) {
            return res.send({error: "El id tiene que ser un número válido"})
        }; 

        const product = await productsModel.find({_id: id});

        res.send({status: "succes", product})

    } catch (error) {
        res.send({status: "error", error: "El producto no fue encontrado"})
    }
});

// Agregar un nuevo producto
router.post("/api/products", async (req, res) => {
    try {
        const newProduct = await productsModel.create(req.body);
        if (!newProduct) {
            return res.status(400).send({status: "error", error: "Valores incompletos"})
        }
        res.send({status: "succes"})

    } catch (error) {
        res.send({status: "succes", error: "Error al agregar el producto"})
    }
});

// Actualizar un producto segun su id
router.put("/api/products/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const elementUpdated = req.body;
        const result = await productsModel.updateOne({_id: id}, elementUpdated);

        if (elementUpdated.length === undefined) {
            return res.status(400).send({status: "error", error: "Error al actualizar un producto"})
        }
        res.send({status: "succes", result, product: elementUpdated})

    } catch (error) {
        return res.status(400).send({status: "error", error: "Error al actualizar un producto"})
    }
});

// Eliminar un producto segund su id
router.delete("/api/products/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const productDeleted = await productsModel.deleteOne({_id: id});

        if (productDeleted.length === undefined) {
            return res.status(400).send({status: "error", error: "Error al eliminar un producto, el producto que quiere elimimnar ya ha sido eliminado"})
        }

        res.send({status: "succes", productDeleted: productDeleted})

    } catch (error) {
        return res.status(400).send({status: "error", error: "Error al eliminar un producto, el id que a introducido no coincide con ningun producto"})
    }
});

export default router