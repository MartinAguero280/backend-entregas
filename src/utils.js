// Ruta absoluta
import {fileURLToPath} from 'url';
import { dirname } from 'path';
// Bcrypt
import bcrypt from 'bcrypt';
// jwt
import jwt from 'jsonwebtoken';
// Config
import { jwtCookieName, jwtPrivateKey } from './config/config.js'
// passport
import passport from 'passport';
// Faker
import { faker } from '@faker-js/faker';



// Ruta absoluta
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename)


// bcrypt
// Hashear password
export const encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Comparar passwords 
export const comparePassword = (password, encryptedPassword) => {
    return bcrypt.compareSync(password, encryptedPassword)
};


// JWT
// Generar token
export const generateToken = user => {
    return jwt.sign({user}, jwtPrivateKey, {expiresIn: '24h'})
}

// Auth token
export const authToken = (req, res, next) => {
    const authToken = req.cookies.jwtCookieName;

    if (!authToken) return res.status(401).render('errors/error', {error: 'the token does not exist'});
    jwt.verify(token, jwtPrivateKey, (error, credentials) => {
        if (error) return res.status(401).render('errors/error', {error: 'Username does not exist'});
        req.user = {...user};
        next()
    })
}

// Passport call
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err);
            req.user = user;
            next()
        })(req, res, next)
    }
}

// role authorization system
export function requireRole(...role) {
    return [
        passportCall('jwt'),
        (req, res, next) => {

        try {

            if (!req.user.user) {
                return res.status(401).redirect('/sessions/login')
            }

            const isAdmin = req.user.user.role === 'admin';
            if (isAdmin) return next()

            const differentRole = role.every(role => role !== req.user.user.role)
            if (differentRole) {
                return res.status(401).render('errors/error',{error: `No tienes acceso a esta página`})
            }

            const equalRole = role.includes(req.user.user.role)
            if (equalRole) return next();

            return next();

        } catch (error) {
            res.status(500).send({error: 'Error role'})
        }
    }];
}

// Generate random string function
export function generateRandomString() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 3; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Date
export function getCreatedAt() {
    const now = new Date();
    return now;
}

// Faker generate products
faker.locale = 'es'; // Idioma de datos
export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.department(),
        stock: faker.random.numeric(1),
        id: faker.database.mongodbObjectId(),
        image: faker.image.image()
    }
}
