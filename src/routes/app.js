// Express
import express from "express";
// Servers
import { Server as HttpServer } from 'http';
import { Server as IOserver} from 'socket.io'
// Ruta absoluta
import { __dirname } from "./utils.js";
// Handlebars
import handlebars from 'express-handlebars';
import Handlebars from 'handlebars';
// Routers
import homeRouter from './routes/home.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mockingProductsModel from "./routes/mockingproducts.js";
import loggerTest from "./routes/loggerTest.router.js";
import usersRouter from './routes/users.router.js';
// Models
import { productModel } from "./dao/mongo/models/product.model.js";
import { chatModel } from "./dao/mongo/models/chat.model.js";
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
// Compression
import compression from "express-compression";
// Error Handler
import errorHandler from "./middlewares/errors/error_middleware.js";
// Loggers
import { addLogger } from './utils/logger.js';
// Swagger
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';





// Express
const app = express();
const httpServer = new HttpServer(app);
const io = new IOserver(httpServer);

// Compression
app.use(compression());

// Express Json
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Loggers
app.use(addLogger)

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
        ttl: 1
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
app.use('/', homeRouter, productsRouter, cartsRouter, usersRouter);
app.use('/Loggertest', loggerTest);
app.use('/sessions', sessionsRouter);
app.use('/realtimeproducts', homeRouter);
app.use('/mockingproducts', mockingProductsModel);


// Error Handler
app.use(errorHandler);


// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
// Helper handlebars
Handlebars.registerHelper('ifUnequals', function(arg1, arg2, options) {
    return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});


// Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion de Ecommerce BackEnd',
            description: 'Esta es la documentacion oficial de Ecommerce BackEnd'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


// Chat
let messages = [];
io.on("connection", async socket => {
    console.log("New client conected id:" + socket.id);

    const products = await productModel.find({});
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


const server = httpServer.listen(port, () => console.log(`server running on port ${port}`));
