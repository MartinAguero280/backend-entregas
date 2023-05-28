// Passport
import passport from 'passport';
import local from 'passport-local';
// Utils
import { encryptPassword, comparePassword, generateToken, authToken, getCreatedAt} from '../utils.js';
// Github
import GitHubStrategy from 'passport-github2';
// JWT
import jwt from 'passport-jwt';
// Config
import { jwtCookieName, jwtPrivateKey, githubClientId, githubClientSecret, githubCallBackUrl, adminEmail, adminPassword } from '../config/config.js'
// Controller
import UserController from '../controllers/user.controller.js';
import CartController from '../controllers/cart.controller.js';

const User = new UserController();
const Cart = new CartController();


const localStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {

    passport.use('register', new localStrategy(
        {
            passReqToCallback: true, usernameField: 'email'
        },
        async (req, username, password, done) => {

            const {name, lastname, age} = req.body;

            try {

                const user = await User.findOne({email: username});
                if (user) {
                    return done('Usuario ya existe', false)
                }

                const cart = {
                    products: [
                        
                    ],
                }
                
                const newCart = await Cart.create({cart});

                const newUser = {
                    first_name: name,
                    last_name: lastname,
                    age,
                    email: username,
                    password: encryptPassword(password),
                    cart: newCart.id
                }

                const result = await User.create(newUser);
                
                return done(null, result)

            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('login', new localStrategy(
        { usernameField: 'email' },
        async(username, password, done) => {
            try {

                const user = await User.findOne({email: username});

                if (!user) {
                    return done('Usuario no registrado', false)
                }

                if (!comparePassword(password, user.password)) {
                    return done('Usuario y/o contraseña incorrectos', false)
                }

                user.token = generateToken(user);
                User.updateOne({email: username}, { $set: { last_connection: getCreatedAt() }});

                return done(null, user)

            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([req => (req && req.cookies) ? req.cookies[jwtCookieName] : null]),
        secretOrKey: jwtPrivateKey
    }, async (jwt_payload, done) => {
        done(null, jwt_payload)
    }))

    passport.use('current', new localStrategy(
        { usernameField: 'email' },
    async (username, password, done) => {

        const user = await User.findOne({email: username});

        if (!user) {
            return done('Usuario no registrado', false)
        }

        if (!comparePassword(password, user.password)) {
            return done('La contraseña es incorrecta', false)
        }

        done(null, user)
    }))

    passport.use('github', new GitHubStrategy(
        {
            clientID: githubClientId,
            clientSecret: githubClientSecret,
            callbackURL: githubCallBackUrl
        },
        async(accessToken, refreshToken, profile, done) => {  

            try {

                const user = await User.findOne({email: profile._json.email});

                if (user) {
                    user.token = generateToken(user);
                    return done(null, user)
                };

                const cart = {
                    products: [
                        
                    ],
                }
                
                const newCart = await Cart.create({cart});

                const userGitHub = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: '',
                    email: profile._json.email,
                    password: '',
                    cart: newCart.id
                };

                const result = await User.create(userGitHub);

                userGitHub.token = generateToken(userGitHub);

                return done(null, userGitHub)

            } catch (error) {
                return done('Error al loguearse con Github' + error)
            }
        }
    ))


    passport.serializeUser((user, done) => {
        done(null,user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user)
    })
};

export default initializePassport;