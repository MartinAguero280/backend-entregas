// Express
import express from "express";
// Servers
import { Server as HttpServer } from 'http';
import { Server as IOserver} from 'socket.io'
// Ruta absoluta
import { __dirname } from "./utils.js";
// Handlebars
import handlebars from 'express-handlebars';
// Mongoose
import mongoose from "mongoose";
// Routers
import homeRouter from './routes/home.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import sessionsRouter from './routes/sessions.router.js';
// Models
import { productsModel } from "./dao/models/products.model.js";
import { chatModel } from "./dao/models/chat.model.js";
// Express session
import session from "express-session"; 
import MongoStore from "connect-mongo";
// Passport
import passport from 'passport';
import initializePassport from "./config/passport.config.js";
// Cookie parser
import cookieParser from "cookie-parser";
// Config
import { port, mongoUri, sessionSecret, sessionName } from "./config/config.js";



// Express
const app = express();
const httpServer = new HttpServer(app);
const io = new IOserver(httpServer);

// Cookie parser
app.use(cookieParser());

// Express session 
app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoUri,
        dbName: sessionName,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 100
    }),
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true
}))


// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(__dirname + '/public'));
app.use('/', homeRouter, productsRouter, cartsRouter);
app.use('/sessions', sessionsRouter);
app.use('/realtimeproducts', homeRouter);

app.use(express.json());
app.use(express.urlencoded({extended: true}));


//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

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
mongoose.connect(mongoUri, error => {
    if (error) {
        console.error("No se pudo conectar a la base de datos", error);
        process.exit()
    }
});


const server = httpServer.listen(port, () => console.log(`server running on port ${port}`));
