import express from "express";
import { sessionsModel } from "../dao/models/sessions.model.js";


const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));

export function auth(req, res, next) {
    if (req.session?.user) return next();

    return res.status(401).render("errors/error", {error: "No autenticado,logueate para ver esta página"})
}


// Sessions

// View login
router.get("/login", async (req, res) => {
    res.render('sessions/login')
});

// Login
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (email.length <= 0 || password.length <= 0) {
            return res.status(401).render('errors/error', { error: 'Error: Valores incompletos' })
        }

        const session = await sessionsModel.findOne({email, password});

        if (!session) {
            return res.status(401).render('errors/error', { error: 'User y/o password incorrectos' })
        }

        req.session.user = email;

        req.session.rol = "user"

        if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
            req.session.rol = "admin"
        }

        res.redirect("/products")

    } catch (error) {
        console.log("Error al traer los productos");
    }
});

// View register
router.get("/register", async (req, res) => {
    res.render('sessions/register', {});
});

// Register
router.post("/register", async (req, res) => {
    
    try {
        const {email, password} = req.body;
        const newUser = req.body;

        if (email.length <= 0 || password.length <= 0) {
            return res.status(401).render('errors/error', { error: 'Error: Valores incompletos' })
        }

        const userInDb = await sessionsModel.findOne({email});

        if (userInDb) {
            return res.status(401).render('errors/error', { error: 'Error: Usuario existente' })
        }

        await sessionsModel.create(newUser);

        res.redirect('/sessions/login')

    } catch (error) {
        console.log("ERROR", error);
    }
});

//Logout
router.get("/logout", async (req, res) => {
    req.session.destroy(err => {
        if (!err) res.redirect("/sessions/login")
        else res.render("errors/error", {error: "Error al hacer logout"})
    });
})



export default router