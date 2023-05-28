import { CartService } from "../repositories/index.js";
// Nodemailer
import nodemailer from 'nodemailer'
// Controllers
import ProductController from "../controllers/product.controller.js";
import TicketController from "../controllers/ticket.controller.js"
// Config
import { emailNodeMailer, passwordNodeMailer } from "../config/config.js";

const Product = new ProductController;
const Ticket = new TicketController;

export default class CartController {
    constructor() {
        this.CartService = CartService;
    }

    create = async (cart) => {
        return this.CartService.create(cart)
    }

    find = async (c) => {
        return this.CartService.find(c);
    }

    findOne = async (c) => {
        return this.CartService.findOne(c);
    }

    findById = async (id) => {
        return this.CartService.findById(id)
    }

    replaceOne = async (condition, object) => {
        return this.CartService.replaceOne(condition, object)
    }

    updateOne = async (condition, object) => {
        return this.CartService.updateOne(condition, object)
    }

    deleteOne = async (condition) => {
        return this.CartService.deleteOne(condition)
    }

    addToCart = async (idc, idp) => {

        const productById = await Product.find({_id: idp});
        const cartById = await CartService.find({_id: idc});

        const isInCartBoolean = cartById[0].products.some(product => product.product._id == idp);

        if (isInCartBoolean) {

            const productId = cartById[0].products.find(product => product.product._id == idp);
            productId.quantity = productId.quantity + 1;
            const newProductsNoId = cartById[0].products.filter(product => product.product._id != idp);

            cartById[0].products = newProductsNoId;
            cartById[0].products.push(productId);

            const result = await CartService.replaceOne({_id: idc}, cartById[0])

            return result
        }

        productById.quantity = 1;

        cartById[0].products.push({product: productById[0]._id, quantity: productById.quantity})

        const result = await CartService.replaceOne({_id: idc}, cartById[0])

        return result
    }

    deleteProductInCart = async (idc, idp) => {
        const cartById = await CartService.findOne({_id: idc});
        const newproducts = cartById.products.filter( products => products.product != idp );
        const result = await CartService.updateOne({_id: idc}, {$set: {products: newproducts}})
        return result
    }

    updateStock = async (idp, idc, quantityUpdated) => {
        const cartById = await CartService.findOne({_id: idc});
        const productById = cartById.products.find( product => product.product == idp);
        productById.quantity = quantityUpdated;
        const products = cartById.products.filter( product => product.product != idp);
        products.push(productById)
        const result = await CartService.updateOne({_id: idc}, {$set: {products: products}})
        return result
    }

    cartTotalPrice = async (cartById) => {
        let total = 0;
        for (const cartProduct of cartById[0].products) {
            const product = await Product.findById(cartProduct.product._id);
            total += product.price * cartProduct.quantity
        }
        return total
    }

    purchaseCart = async (idc, cartById, req) => {
        let total = 0;
        let productsRegected = []

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
            return {
                total: total,
                productsWithoutStock: productsWithoutStock
            }
        }

        const ticket = {
            purchaser: req.user.user.email,
            amount: total,
        }

        const createTicket = await Ticket.create(ticket);

        const cartUpdated = await CartService.updateOne({_id: idc}, {$set: {products: productsWithoutStock}})

        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: emailNodeMailer,
                pass: passwordNodeMailer
            }
        })

        const mail = await transport.sendMail({
            from: emailNodeMailer,
            to: req.user.user.email,
            subject: 'BackEnd ecommerce',
            html: `
                <div>
                    <h1>BackEnd ecommerce</h1>

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
            return {productsWithoutStock: productsWithoutStock}
        }

        return {cartUpdated}
    }

}