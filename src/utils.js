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


// Ruta absoluta
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename)

// Authentication function
export function auth(req, res, next) {
    if (req.session?.user) return next();

    return res.status(401).render("errors/error", {error: "No autenticado, logueate para ver esta página"})
}

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
        req.user = credentials.user;
        next()
    })
}

// Passport call
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err);
            if (!user) return res.status(401).render('errors/error', {error: info.message ? info.messages : info.toString()})

            req.user = user;
            next()
        })(req, res, next)
    }
}

// role authorization system
export function requireRole(role) {
    return (req, res, next) => {

    if (req.user.user.role === 'admin') {
        return next();
    }
    if (!req.user.user || req.user.user.role !== role) {
        return res.status(401).render('errors/error', {error: 'You do not have access to this page'});
    }
    return next();
    };
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
