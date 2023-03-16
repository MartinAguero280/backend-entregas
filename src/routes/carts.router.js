// Express
import express from "express";
// Nodemailer
import nodemailer from 'nodemailer'
// jwt auth
import { passportCall } from "../utils.js";
// Controllers
import CartController from "../controllers/cart.controller.js";
import ProductController from "../controllers/product.controller.js";
import TicketController from "../controllers/ticket.controller.js"

const router = express.Router();
const Cart = new CartController;
const Product = new ProductController;
const Ticket = new TicketController;


// Cart 

// View carts segun su id
router.get("/carts/:id", passportCall('jwt'), async (req, res) => {

    try {

        const idc = req.params.id;

        const cartById = await Cart.find({_id: idc});
        const productsInCartById = cartById[0].products;

        res.render("carts", {products: productsInCartById});
    } catch (error) {
        res.render("carts")
    }
});

// Crear carrito
router.post("/api/carts", passportCall('jwt'), async (req, res) => {

    const cart = {
        products: [
            
        ],
    }

    const newCart = await Cart.create({cart});


    if (!newCart) {
        return res.status(400).send({status: "error", error: "No se a podido agregar el carrito"})
    }
    res.send({status: "succes"})
});

// Mostrar todos los carritos
router.get("/api/carts", passportCall('jwt'), async (req, res) => {

    try {
        const allCarts = await Cart.find();

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
router.get("/api/carts/:id", passportCall('jwt'), async (req, res) => {

    try {
        const {id} = req.params;

        const cart = await Cart.findOne({_id: id});
        //console.log(JSON.stringify(cart, null, "\t"));

        res.send({status: "succes", cart})

    } catch (error) {
        console.log(error);
        res.send({status: "error", error: "El carrito no fue encontrado"})
    }
});

// Agregar productos segun su id a los carritos segun su id
router.post("/api/carts/:idc/product/:idp", passportCall('jwt'), async (req, res) => {
    try {

        const idc = req.params.idc;
        const idp = req.params.idp;

        if (idc.length < 0 || idp.length < 0) {
            return res.send({error: "Los id tienen que ser válidos"})
        };

        const productById = await Product.find({_id: idp});
        const cartById = await Cart.find({_id: idc});

        const isInCartBoolean = cartById[0].products.some(product => product.product._id == idp);
        //console.log(cartById[0].products);

        if (isInCartBoolean) {

            const productId = cartById[0].products.find(product => product.product._id == idp);
            productId.quantity = productId.quantity + 1;
            const newProductsNoId = cartById[0].products.filter(product => product.product._id != idp);

            cartById[0].products = newProductsNoId;
            cartById[0].products.push(productId);

            const result = await Cart.replaceOne({_id: idc}, cartById[0])

            return res.send({status: "succes", result})
        }

        productById.quantity = 1;

        cartById[0].products.push({product: productById[0]._id, quantity: productById.quantity})

        const result = await Cart.replaceOne({_id: idc}, cartById[0])

        res.send({status: "succes", result})

    } catch (error) {
        res.send({status: "error", error: "id de carrito o id de producto incorrectos"})
    }
});

// Eliminar productos segun su id del carrito seleccionado segun su id
router.delete("/api/carts/:idc/product/:idp", passportCall('jwt'), async (req, res) => {
    try {
        const {idc, idp} = req.params;

        if (!idc || !idp) {
            return res.send({error: "Los id tienen que ser válidos"})
        };

        const cartById = await Cart.findOne({_id: idc});

        const newproducts = cartById.products.filter( products => products.product != idp );

        const result = await Cart.updateOne({_id: idc}, {$set: {products: newproducts}})

        res.send({status: "succes", result})

    } catch (error) {
        res.send({status: "error", error: "id de carrito o id de producto incorrectos"})
    }
});

// Actualizar un carrito forsosamente por lo que contenga el body
router.put("/api/carts/:id", passportCall('jwt'), async (req, res) => {

    try {
        const id = req.params.id;

        const elementUpdated = req.body;

        const result = await Cart.updateOne({_id: id}, elementUpdated);

        res.send({status: "succes", result})
    } catch (error) {
        res.send({error: "Error al actualizar el carrito"})
    }
});

// Actualizar solo la cantidad de ejemplares del producto
router.put("/api/carts/:idc/product/:idp", passportCall('jwt'), async (req, res) => {

    try {

        const { idp, idc } = req.params;

        const quantityUpdated = req.body.quantity;

        if (!idc || !idp) {
            return res.send({error: "Los id tienen que ser válidos"})
        };

        const cartById = await Cart.findOne({_id: idc});

        const productById = cartById.products.find( product => product.product == idp);
        productById.quantity = quantityUpdated;
        
        const products = cartById.products.filter( product => product.product != idp);
        products.push(productById)

        const result = await Cart.updateOne({_id: idc}, {$set: {products: products}})

        res.send({status: "succes", result})


    } catch (error) {
        res.send({status: "error", error: "Error al actualizar el quantity de un producto dentro de un carrito"})
    }
});

// Eliminar todos los productos de un carrito según su id
router.delete("/api/carts/:id", passportCall('jwt'), async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.send({error: "El id tienen que ser válidos"})
        };
        
        const result = await Cart.updateOne({_id: id}, { $set: { products: [] }});


        res.send({status: "succes", result})

    } catch (error) { 
        res.send({status: "error", error: "id de carrito o id de producto incorrectos"})
    }

});

// Finalizar compra de carrito segun su id
router.post("/carts/:id/purchase", passportCall('jwt'), async( req, res) => {
    try {
        
        const idc = req.params.id;

        const cartById = await Cart.find({_id: idc});

        let total = 0;
        let productsRegected = []
        let newCart = []

        for (const cartProduct of cartById[0].products) {
            const product = await Product.findById(cartProduct.product._id);

            if (cartProduct.quantity > product.stock) {
                productsRegected.push(cartProduct.product)
            }

            if (product.stock >= cartProduct.quantity) total += product.price * cartProduct.quantity || 0;
            const newStock = product.stock < cartProduct.quantity ? product.stock : product.stock - cartProduct.quantity; 

            const updateProduct = await Product.findOneAndUpdate(
                { title: product.title }, 
                { stock: newStock },
                { new: true }
            );
        }

        const productsWithoutStock = cartById[0].products.filter(product => productsRegected.includes(product.product));
        const productsWithStock = cartById[0].products.filter(product => !productsRegected.includes(product.product));

        if (total === 0) {
            return res.send({status: "error", error: 'No se pudo realizar la compra por falta de stock en los siguientes productos', products: productsWithoutStock})
        }

        const ticket = {
            purchaser: req.user.user.email,
            amount: total,
        }

        const createTicket = await Ticket.create(ticket);

        const cartUpdated = await Cart.updateOne({_id: idc}, {$set: {products: productsWithoutStock}})

        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: '',
                pass: ''
            }
        })

        const mail = await transport.sendMail({
            from: '',
            to: '',
            subject: 'ManoniMotoRep Tienda Online',
            html: `
                <div>
                    <h1>ManoniMotoRep Tienda Online</h1>

                    <h2>Gracias por su compra ${createTicket.purchaser}</h2>

                    <h3>Ticket de compra</h3>

                    
                    <h4>Productos:</h4>
                    <ul>
                        ${productsWithStock.map(product => `<li>Nombre: ${product.product.title} - Precio: $${product.product.price} - Cantidad: ${product.quantity}</li>`).join("")}
                    </ul>
                    <h4>Total: $${createTicket.amount} </h4>

                    <h4>Productos que no se pudieron comprar por falta de stock:</h4>
                    ${productsWithoutStock.length > 0 ? 
                        `<ul>
                            ${productsWithoutStock.map(product => `<li>Nombre: ${product.product.title} - Precio: $${product.product.price} - Cantidad: ${product.quantity}</li>`).join("")}
                        </ul>` :
                        `<p>No hay productos sin stock.</p>`
                    }
                </div>
            `,
            attachments: []
        })

        if (productsRegected.length > 0) {
            return res.send({status:'succes', messsage:'Falta de stock en los siguientes productos', products: productsWithoutStock})
        }

        res.send({status: "succes", message: 'Compra realizada exitosamente'})

    } catch (error) {
        res.send({error: 'Ocurrio un error al realizar la compra'})
    }
})

export default router