// Express
import express from "express";
// Bcrypt
import bcrypt from 'bcrypt';
// Passport
import passport from "passport";


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

        req.session.user = email;

        req.session.rol = "user"

        if (email == "adminCoder@coder.com") {
            req.session.rol = "admin"
        }

        res.redirect("/products")

    } catch (error) {
        console.log(error);
    }

    /*try {

        const { email, password } = req.body;

        if (email.length <= 0 || password.length <= 0) {
            return res.status(401).render('errors/error', { error: 'Error: Valores incompletos' })
        }

        const user = await sessionsModel.findOne({email});

        if (!user) {
            return res.status(401).render('errors/error', { error: 'Error: User inexistente' })
        }

        if (!comparePassword(password, user.password)) {
            return res.status(403).render('errors/error', { error: 'Error: Contraseña incorrecta' })
        }

        req.session.user = email;

        req.session.rol = "user"

        if (email == "adminCoder@coder.com") {
            req.session.rol = "admin"
        }

        res.redirect("/products")

    } catch (error) {
        console.log("Error al traer los productos");
    }*/
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

    /*try {
        const {email, password} = req.body;

        const newUser = req.body;
        newUser.password = encryptPassword(newUser.password);

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
    }*/
});

// Fail register
router.get("/failregister", async (req, res) => {
    res.render('error/errors', { error: 'Register error' })
});


//Logout
router.get("/logout", async (req, res) => {
    req.session.destroy(err => {
        if (!err) res.redirect("/sessions/login")
        else res.render("errors/error", {error: "Error al hacer logout"})
    });
})



export default router