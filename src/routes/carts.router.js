import express from "express";
import { cartsModel } from "../dao/models/carts.model.js";
import { productsModel } from "../dao/models/products.model.js";
// Authentication
import { auth } from './sessions.router.js'

const router = express.Router();

// Cart

// View carts segun su id
router.get("/carts/:id", auth, async (req, res) => {

    try {

        const idc = req.params.id;

        const cartById = await cartsModel.find({_id: idc}).lean();

        const productsInCartById = cartById[0].products;

        res.render("carts", {products: productsInCartById});
    } catch (error) {
        res.render("carts")
    }
});

// Crear carrito
router.post("/api/carts", async (req, res) => {

    const cart = {
        products: [
            
        ],
    }

    const newCart = await cartsModel.create({cart});


    if (!newCart) {
        return res.status(400).send({status: "error", error: "No se a podido agregar el carrito"})
    }
    res.send({status: "succes"})
});

// Mostrar todos los carritos
router.get("/api/carts", async (req, res) => {

    try {
        const allCarts = await cartsModel.find();

        const {limit} = req.query
        if (!limit || limit < 1) {
            return res.send({ carts: allCarts});
        }

        const carts = allCarts.slice(0, limit)

        res.send({ carts })
    } catch (error) {
        console.log("Error al traer los carritos");
    }
});

// Mostrar carrito segun su id
router.get("/api/carts/:id", async (req, res) => {

    try {
        const {id} = req.params;

        const cart = await cartsModel.findOne({_id: id});
        console.log(JSON.stringify(cart, null, "\t"));

        res.send({status: "succes", cart})

    } catch (error) {
        console.log(error);
        res.send({status: "error", error: "El carrito no fue encontrado"})
    }
});

// Agregar productos segun su id a los carritos segun su id
router.post("/api/carts/:idc/product/:idp", async (req, res) => {
    try {

        const idc = req.params.idc;
        const idp = req.params.idp;

        if (idc.length < 0 || idp.length < 0) {
            return res.send({error: "Los id tienen que ser válidos"})
        };

        const productById = await productsModel.find({_id: idp});
        const cartById = await cartsModel.find({_id: idc});

        const isInCartBoolean = cartById[0].products.some(product => product.product._id == idp);
        console.log(cartById[0].products);

        if (isInCartBoolean) {

            const productId = cartById[0].products.find(product => product.product._id == idp);
            productId.quantity = productId.quantity + 1;
            const newProductsNoId = cartById[0].products.filter(product => product.product._id != idp);

            cartById[0].products = newProductsNoId;
            cartById[0].products.push(productId);

            const result = await cartsModel.replaceOne({_id: idc}, cartById[0])

            return res.send({status: "succes", result})
        }

        productById.quantity = 1;

        cartById[0].products.push({product: productById[0]._id, quantity: productById.quantity})

        const result = await cartsModel.replaceOne({_id: idc}, cartById[0])

        res.send({status: "succes", result})

    } catch (error) {
        res.send({status: "error", error: "id de carrito o id de producto incorrectos"})
    }
});

// Eliminar productos segun su id del carrito seleccionado segun su id
router.delete("/api/carts/:idc/product/:idp", async (req, res) => {
    try {
        const {idc, idp} = req.params;

        if (!idc || !idp) {
            return res.send({error: "Los id tienen que ser válidos"})
        };

        const cartById = await cartsModel.findOne({_id: idc});

        const newproducts = cartById.products.filter( products => products.product != idp );

        const result = await cartsModel.updateOne({_id: idc}, {$set: {products: newproducts}})

        res.send({status: "succes", result})

        //Error
        //const result = await cartsModel.updateOne({_id: idc}, {$pull: {products: {id: idp}}});
        /*const result = cartsModel.findOneAndUpdate(
            { _id: idc },
            { $pull: { products: { id: idp } } },
            { new: true }
        );*/

    } catch (error) {
        res.send({status: "error", error: "id de carrito o id de producto incorrectos"})
    }
});

// Actualizar un carrito forsosamente por lo que contenga el body
router.put("/api/carts/:id", async (req, res) => {

    try {
        const id = req.params.id;

        const elementUpdated = req.body;

        const result = await cartsModel.updateOne({_id: id}, elementUpdated);

        res.send({status: "succes", result})
    } catch (error) {
        res.send({error: "Error al actualizar el carrito"})
    }
});

// Actualizar solo la cantidad de ejemplares del producto
router.put("/api/carts/:idc/product/:idp", async (req, res) => {

    try {

        const { idp, idc } = req.params;

        const quantityUpdated = req.body.quantity;

        if (!idc || !idp) {
            return res.send({error: "Los id tienen que ser válidos"})
        };

        const cartById = await cartsModel.findOne({_id: idc});

        const productById = cartById.products.find( product => product.product == idp);
        productById.quantity = quantityUpdated;
        
        const products = cartById.products.filter( product => product.product != idp);
        products.push(productById)

        const result = await cartsModel.updateOne({_id: idc}, {$set: {products: products}})

        res.send({status: "succes", result})

        //ERROR
        //const result = await cartsModel.updateOne({_id: idc, "products.$.id": idp}, {$set: {"products.$.quantity": quantityUpdated}});

        //const result = await cartsModel.updateOne({_id: idc}, {$set: {"products[0].quantity": quantityUpdated}}, {arrayFilters: [{"products[0].id": idp}]});

        //const result = await cartsModel.findOneAndUpdate({_id: idc, "products.id": idp}, {$set: {"products[0].quantity": quantityUpdated}});

        /*const result = await cartsModel.updateOne(
            { _id: idc, "products": { $elemMatch: { "id": idp } } },
            { $set: { "products.quantity": quantityUpdated } }
        )*/

    } catch (error) {
        res.send({status: "error", error: "Error al actualizar el quantity de un producto dentro de un carrito"})
    }
});

// Eliminar todos los productos de un carrito según su id
router.delete("/api/carts/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.send({error: "El id tienen que ser válidos"})
        };
        
        const result = await cartsModel.updateOne({_id: id}, { $set: { products: [] }});


        res.send({status: "succes", result})

    } catch (error) { 
        res.send({status: "error", error: "id de carrito o id de producto incorrectos"})
    }

});

export default router