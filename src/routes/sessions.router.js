// Express
import express from "express";
// Passport
import passport from "passport";
// JWT
import { jwtCookieName } from '../config/config.js'
// Passport call
import { requireRole, comparePassword} from "../utils.js";
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

    passport.authenticate('login', { failureRedirect: 'sessions/faillogin' }, (error, user) => {
    if (error) {
        return res.status(500).render('errors/error', {error});
    }
    req.logIn(user, (error) => {
        if (error) {
        return res.status(500).render('errors/error', {error});
        }

        return res.cookie(jwtCookieName, req.user.token).redirect("/products");
    });
    })(req, res, next);
});

// Fail login
router.get("/faillogin", async (req, res) => {
    res.render('errors/error', { error: 'Login error' })
});


// // Login Github
// router.get('/login-github', passport.authenticate('github', {scope: ['user: email']}), async(req, res) => {})
// // Github callback
// router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {

//     res.cookie(jwtCookieName, req.user.token).redirect("/products")

// })

// Login Github
router.get('/login-github', (req, res, next) => {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});
// Github callback
router.get('/githubcallback', (req, res, next) => {
    passport.authenticate('github', { failureRedirect: '/login' }, (error, user) => {
        if (error) {
            return res.status(500).render('errors/error', { error });
        }
        req.logIn(user, (error) => {
            if (error) {
                return res.status(500).render('errors/error', { error });
            }
            return res.cookie(jwtCookieName, req.user.token).redirect("/products");
        });
    })(req, res, next);
});


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
router.get("/current", requireRole('user', 'premium'), async (req, res) => {
    const user = new UserDTO(req.user.user);
    res.render('sessions/current', { user })
})


//Logout
router.get("/logout", async (req, res) => {
    return res.clearCookie(jwtCookieName).redirect('login');
})



export default router