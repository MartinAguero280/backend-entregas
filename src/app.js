import express from "express";
import {ProductManager} from "./Managers/ProductManager.js";
import { CartsManager } from "./Managers/CartManager.js";
import { Server as HttpServer } from 'http';
import { Server as IOserver} from 'socket.io'
import __dirname from "./utils.js";
import handlebars from 'express-handlebars';
import homeRouter from './routes/home.router.js';
import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";
import { cartsModel } from "./models/carts.model.js";
import { chatModel } from "./models/chat.model.js";


const productManager = new ProductManager("./src/db/products.json");
const cartsManager = new CartsManager("./src/db/carts.json");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOserver(httpServer);


app.use(express.json());
app.use( express.urlencoded({extended: true}));

const port = 8080;

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use('/', homeRouter);
app.use('/realtimeproducts', homeRouter);





// Products

// Mostrar todos los productos
app.get("/api/products", async (req, res) => {

    try {
        const allProducts = await productsModel.find();

        const {limit} = req.query
        if (!limit || limit < 1) {
            return res.send({ products: allProducts});
        }

        const products = allProducts.slice(0, limit)

        res.send({ products })
    } catch (error) {
        console.log("Error al traer los productos");
    }
});

// Mostrar ub producto segun su id
app.get("/api/products/:id", async (req, res) => {
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
app.post("/api/products", async (req, res) => {
    try {
        const newProduct = await productsModel.create(req.body);
        if (!newProduct) {
            return res.status(400).send({status: "error", error: "Valores incompletos"})
        }
        res.send({status: "succes"})

    } catch (error) {
        console.log(error);
    }
});

// Actualizar un producto segun su id
app.put("/api/products/:id", async (req, res) => {
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
app.delete("/api/products/:id", async (req, res) => {
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



// Cart

// Crear carrito
app.post("/api/carts", async (req, res) => {

    const cart = {
        products: [
            
        ],
    }

    const newCart = await cartsModel.create(cart);


    if (!newCart) {
        return res.status(400).send({status: "error", error: "No se a podido agregar el carrito"})
    }
    res.send({status: "succes"})
})

// Mostrar todos los carritos
app.get("/api/carts", async (req, res) => {

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

// Mostrar carrito segund su id
app.get("/api/carts/:id", async (req, res) => {

    try {
        const {id} = req.params;

        const cart = await cartsModel.find({_id: id});

        res.send({status: "succes", cart})

    } catch (error) {
        console.log(error);
        res.send({status: "error", error: "El carrito no fue encontrado"})
    }
});

// Agregar productos segun su id a los carritos segun su id
app.post("/api/carts/:idc/product/:idp", async (req, res) => {
    try {

        const idc = req.params.idc;
        const idp = req.params.idp;

        if (idc.length < 0 || idp.length < 0) {
            return res.send({error: "Los id tienen que ser válidos"})
        };

        const productById = await productsModel.find({_id: idp});
        const cartById = await cartsModel.find({_id: idc});

        const isInCartBoolean = cartById[0].products.some(product => product.id == idp);

        if (isInCartBoolean) {

            const productId = cartById[0].products.find(product => product.id == idp);
            productId.quantity = productId.quantity + 1;
            const newProductsNoId = cartById[0].products.filter(product => product.id != idp);

            cartById[0].products = newProductsNoId;
            cartById[0].products.push(productId);

            const result = await cartsModel.replaceOne({_id: idc}, cartById[0])

            return res.send({status: "succes", result})
        }

        productById.quantity = 1;

        cartById[0].products.push({id: productById[0]._id, quantity: productById.quantity})

        const result = await cartsModel.replaceOne({_id: idc}, cartById[0])

        res.send({status: "succes", result})

    } catch (error) {
        res.send({status: "error", error: "id de carrito o id de producto incorrectos"})
    }
});


// Chat

let messages = [];

io.on("connection", async socket => {
    console.log("New client conected id:" + socket.id);

    const products = await productsModel.find({});
    io.sockets.emit("products", products)
    
    // Escucha los mensajes de un usuario
    socket.on("message", data => {

        // Guarda el mensage
        messages.push(data);

        //Emite el mensaje para los demas usuarios
        io.emit("messageLogs", messages)
        chatModel.create(data)
    })
})


// Coneccion a DB Mongo Atlas
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://adminProducts:bFyK3kj1FvRcNmlC@cluster0.v16gk5m.mongodb.net/?retryWrites=true&w=majority", error => {
    if (error) {
        console.error("No se pudo conectar a la base de datos", error);
        process.exit()
    }
});


const server = httpServer.listen(port, () => console.log(`server running on port ${port}`));
