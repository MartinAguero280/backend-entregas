// Express
import express from "express";
// Bcrypt
import bcrypt from 'bcrypt';
// Passport
import passport from "passport";
import { sessionsModel } from "../dao/models/sessions.model.js";


const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));


// Authentication function
export function auth(req, res, next) {
    if (req.session?.user) return next();

    return res.status(401).render("errors/error", {error: "No autenticado, logueate para ver esta página"})
}

// Hashear password
export const encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Comparar passwords 
export const comparePassword = (password, encryptedPassword) => {
    return bcrypt.compareSync(password, encryptedPassword)
};


// Sessions

// View login
router.get("/login", async (req, res) => {
    res.render('sessions/login')
});

// Login
router.post("/login", passport.authenticate('login', { failureDirect: '/session/faillogin' }), async (req, res) => {

    try {

        const {email} = req.body

        const user = await sessionsModel.findOne({email});

        req.session.user = user;

        res.redirect("/products")

    } catch (error) {
        console.log(error);
    }
    
});

// Fail login
router.get("/faillogin", async (req, res) => {
    res.render('error/errors', { error: 'Login error' })
});

// Login Github
router.get('/login-github', passport.authenticate('github', {scope: ['user: email']}), async(req, res) => {})
// Github callback
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {
    req.session.user = req.user.email;
    req.session.rol = 'user';
    if (req.session.user == "adminCoder@coder.com") {
        req.session.rol = "admin"
    }
    res.redirect('/products')
})

// View register
router.get("/register", async (req, res) => {
    res.render('sessions/register', {});
});

// Register
router.post("/register", passport.authenticate('register', { failureDirect: '/session/failregister' }), async (req, res) => {

    try {
        res.redirect('/sessions/login')
    } catch (error) {
        console.log('ERROR:', error);
    }
});

// Fail register
router.get("/failregister", async (req, res) => {
    res.render('error/errors', { error: 'Register error' })
});


// Current
router.get("/current", auth, async (req, res) => {
    const user = req.session.user
    res.render('sessions/current', { user })
})


//Logout
router.get("/logout", async (req, res) => {
    req.session.destroy(err => {
        if (!err) res.redirect("/sessions/login")
        else res.render("errors/error", {error: "Error al hacer logout"})
    });
})



export default router