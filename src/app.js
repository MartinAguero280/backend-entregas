import express from "express";
//import {ProductManager} from "./dao/managers/ProductManager.js";
//import { CartsManager } from "./dao/managers/CartManager.js";
import { Server as HttpServer } from 'http';
import { Server as IOserver} from 'socket.io'
import __dirname from "./utils.js";
import handlebars from 'express-handlebars';
import homeRouter from './routes/home.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import mongoose from "mongoose";
import { productsModel } from "./dao/models/products.model.js";
import { chatModel } from "./dao/models/chat.model.js";


//const productManager = new ProductManager("./src/db/products.json");
//const cartsManager = new CartsManager("./src/db/carts.json");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOserver(httpServer);


app.use(express.json());
app.use(express.urlencoded({extended: true}));

const port = 8080;

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use('/', homeRouter, productsRouter, cartsRouter);
app.use('/realtimeproducts', homeRouter);


// Chat

let messages = [];

io.on("connection", async socket => {
    console.log("New client conected id:" + socket.id);

    const products = await productsModel.find({});
    io.emit("products", products)
    
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
