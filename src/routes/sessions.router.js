// Express
import express from "express";
// Passport
import passport from "passport";
// JWT
import { jwtCookieName } from '../config/config.js'
// Passport call
import { requireRole, passportCall } from "../utils.js";
// DTO
import UserDTO from "../dao/DTO/user.dto.js";


const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));


// Sessions

// View login
router.get("/login", async (req, res) => {
    res.render('sessions/login')
});

// Login
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).render('errors/error', { error: 'Usuario y contraseña son requeridos' });
    };
    next();
}, passport.authenticate('login', { failureDirect: 'sessions/faillogin' }), async (req, res) => {
    try {
        res.cookie(jwtCookieName, req.user.token).redirect("/products")
    } catch (error) {
        req.logger.error('Error al hacer login');
    }
});

// Fail login
router.get("/faillogin", async (req, res) => {
    res.render('errors/error', { error: 'Login error' })
});


// Login Github
router.get('/login-github', passport.authenticate('github', {scope: ['user: email']}), async(req, res) => {})
// Github callback
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {

    res.cookie(jwtCookieName, req.user.token).redirect("/products")

})


// View register
router.get("/register", async (req, res) => {
    res.render('sessions/register', {});
});

// Register
router.post("/register", async (req, res, next) => {
    const { name, lastname, age, email, password } = req.body;
    if (!name || !lastname || !age || !email || !password) {
        return res.status(400).render('errors/error', { error: 'Todos los campos son requeridos' });
    };
    next();
}, passport.authenticate('register', { failureDirect: '/sessions/failregister' }), async (req, res) => {
    try {
        res.redirect('/sessions/login')
    } catch (error) {
        req.logger.error('Error al hacer register')
    }
});

// Fail register
router.get("/failregister", async (req, res) => {
    res.render('errors/error', { error: 'Register error' })
});


// Current
router.get("/current", passportCall('jwt'), requireRole('user'), async (req, res) => {
    const user = new UserDTO(req.user.user);
    res.render('sessions/current', { user })
})


//Logout
router.get("/logout", async (req, res) => {

    /*req.session.destroy(err => {
        if (!err) res.redirect("/sessions/login")
        else res.render("errors/error", {error: "Error al hacer logout"})
    });*/

    res.clearCookie(jwtCookieName).redirect('login');
})



export default router