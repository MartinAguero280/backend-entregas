// Express
import express from "express";
// jwt auth
import { requireRole } from "../utils.js";
// Controllers
import CartController from "../controllers/cart.controller.js";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();
const Cart = new CartController;
const Product = new ProductController;


// Cart 

// View carts segun su id
router.get("/carts/:id", requireRole('user', 'premium'), async (req, res) => {

    try {
        const idc = req.params.id;

        if (idc !== req.user.user.cart) {
            return res.status(500).render('errors/error', {error: 'Id de carrito incorrecto'})
        }

        const cartById = await Cart.find({_id: idc});
        const productsInCartById = cartById[0].products;
        const cartTotalPrice = await Cart.cartTotalPrice(cartById);

        return res.status(200).render("carts", {products: productsInCartById, cartId: idc, cartTotalPrice});
    } catch (error) {
        return res.status(500).render('errors/error', {error: "Error al ver el carrito"})
    }
});

// Crear carrito
router.post("/api/carts", requireRole('user', 'premium'), async (req, res) => {

    try {
        const cart = {
            products: [
                
            ],
        }
        const newCart = await Cart.create({cart});
    
        if (!newCart) {
            return res.status(500).send({status: "error", error: "No se a podido agregar el carrito"})
        }
        
        return res.status(200).send({status: "success"})

    } catch (error) {
        return res.status(500).send({status: "error", error: "No se a podido agregar el carrito"})
    }
});

// Mostrar todos los carritos
router.get("/api/carts", requireRole('admin'), async (req, res) => {

    try {
        const allCarts = await Cart.find();

        const {limit} = req.query
        if (!limit || limit < 1) {
            return res.send({ carts: allCarts});
        }

        const carts = allCarts.slice(0, limit)

        res.status(200).send({ carts })
    } catch (error) {
        return res.status(500).send({status: "error", error: "Error al mostrar los carritos"})
    }
});

// Mostrar carrito segun su id
router.get("/api/carts/:id", requireRole('user', 'premium'), async (req, res) => {

    try {
        const {id} = req.params;
        const cart = await Cart.find({_id: id}); 

        res.status(200).send({status: "success", cart})

    } catch (error) {
        res.status(404).send({status: "error", error: "El carrito no fue encontrado"})
    }
});

// Agregar productos mediante su id a los carritos mediante su id
router.post("/api/carts/:idc/product/:idp", requireRole('user', 'premium'), async (req, res) => {

    try {

        const idc = req.params.idc;
        const idp = req.params.idp;

        if (idc.length < 0 || idp.length < 0) {
            return res.status(500).send({status: 'error', error: "Los id tienen que ser válidos"})
        };

        const addToCart = await Cart.addToCart(idc, idp);
        
        if (addToCart.modifiedCount || addToCart.matchedCount !== 1) {
            return res.status(500).send({status: 'error', error: 'Error al añadir al carrito'})
        }

        return res.status(200).send({status: 'success'});

    } catch (error) {
        return res.status(500).send({status: "error", error: "Error al añadir al carrito"})
    }

});

// Eliminar productos mediante id del carrito seleccionado mediante su id
router.delete("/api/carts/:idc/product/:idp", requireRole('user', 'premium'), async (req, res) => {
    try {
        const {idc, idp} = req.params;

        if (!idc || !idp) {
            return res.send({status: 'error', error: "Los id tienen que ser válidos"})
        };

        const deleteProductInCart = await Cart.deleteProductInCart(idc, idp);

        if (deleteProductInCart.modifiedCount || deleteProductInCart.matchedCount !== 1) {
            return res.status(500).send({status: 'error', error: 'Error al eliminar un producto del carrito'})
        }

        return res.send({status: "success", result})

    } catch (error) {
        return res.send({status: "error", error: "Error al eliminar un producto del carrito"})
    }
});

// Actualizar un carrito forzosamente por lo que contenga el body
router.put("/api/carts/:id", requireRole('user', 'premium'), async (req, res) => {

    try {
        const id = req.params.id;

        const elementUpdated = req.body;

        const result = await Cart.updateOne({_id: id}, elementUpdated);

        res.send({status: "success", result})
    } catch (error) {
        res.send({error: "Error al actualizar el carrito"})
    }
});

// Actualizar solo la cantidad de ejemplares del producto
router.put("/api/carts/:idc/product/:idp", requireRole('user', 'premium'), async (req, res) => {

    try {
        const { idp, idc } = req.params;

        const quantityUpdated = req.body.quantity;

        if (!idc || !idp) {
            return res.send({error: "Los id tienen que ser válidos"})
        };

        const updateStock = await Cart.updateStock(idp, idc, quantityUpdated);

        if (updateStock.modifiedCount || updateStock.matchedCount !== 1) {
            return res.status(500).send({status: 'error', error: 'Error al eliminar un producto del carrito'})
        }

        return res.status(200).send({status: 'success'});


    } catch (error) {
        res.send({status: "error", error: "Error al actualizar el quantity de un producto dentro de un carrito"})
    }
});

// Eliminar todos los productos de un carrito según su id
router.delete("/api/carts/:id", requireRole('user', 'premium'), async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.send({error: "El id tiene que ser válidos"})
        };
        
        const result = await Cart.updateOne({_id: id}, { $set: { products: [] }});

        return res.status(200).send({status: "success", result})

    } catch (error) { 
        return res.status(500).send({status: "error", error: "Error al vaciar carrito"})
    }

});

// Finalizar compra de carrito segun su id
router.post("/carts/:id/purchase", requireRole('user', 'premium'), async( req, res) => {

    try {
        const idc = req.params.id;
        const cartById = await Cart.find({_id: idc});

        const cartPurchase = await Cart.purchaseCart(idc, cartById, req);

        if (cartPurchase.total !== undefined && cartPurchase.productsWithoutStock !== undefined) {
            return res.send({status: "error", error: 'No se pudo realizar la compra por falta de stock en los siguientes productos', products: productsWithoutStock})
        }

        if (cartPurchase.productsWithoutStock !== undefined && cartPurchase.total === undefined) {
            return res.send({status:'success', messsage:'Falta de stock en los siguientes productos', products: productsWithoutStock})
        }

        return res.status(200).send({status: "success", message: 'Compra realizada exitosamente'})

    } catch (error) {
        return res.status(500).send({error: 'Ocurrio un error al realizar la compra'})
    }

})

export default router