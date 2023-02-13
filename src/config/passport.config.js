
import passport from 'passport';
import local from 'passport-local';
import { sessionsModel } from '../dao/models/sessions.model.js';
import { encryptPassword, comparePassword } from '../routes/sessions.router.js';
import GitHubStrategy from 'passport-github2';


const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        {
            passReqToCallback: true, usernameField: 'email'
        },
        async (req, username, password, done) => {
            

            const {name, lastname, age} = req.body;

            try {
                // Sin funcionar
                if (username.length <= 0 || password.length <= 0) {
                    return done('Campos incompletos', false)
                }

                const user = await sessionsModel.findOne({email: username});
                if (user) {
                    return done('Usuario ya existe', false)
                }

                const newUser = {
                    first_name: name,
                    last_name: lastname,
                    age,
                    email: username,
                    password: encryptPassword(password)
                }

                const result = await sessionsModel.create(newUser);

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
                // Sin funcionar
                if (username.length <= 0 || password.length <= 0) {
                    return done('Campos incompletos', false)
                }

                const user = await sessionsModel.findOne({email: username});
                if (!user) {
                    return done('Usuario no registrado', false)
                }

                if (!comparePassword(password, user.password)) {
                    return done('La contraseña es incorrecta', false)
                }

                return done(null, user)

            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.0bf69778ed8c1652',
            clientSecret: '6efc246dc08c8eea64db61b50e5afb3b861a89a9',
            callbackURL: 'http://localhost:8080/sessions/githubcallback'
        },
        async(accessToken, refreshToken, profile, done) => {

            

            try {
                profile._json.email = 'perro@perro.com';
                console.log(profile);
                const user = await sessionsModel.findOne({email: profile._json.email});

                if (user) {
                    return done(null, user)
                };

                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: '',
                    email: profile._json.email,
                    password: '',
                };

                const result = await sessionsModel.create(newUser);

                return done(null, result)

            } catch (error) {
                return done('Error al loguearse con Github' + error)
            }
        }
    ))



    passport.serializeUser((user, done) => {
        done(null,user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await sessionsModel.findById(id);
        done(null, user)
    })
};

export default initializePassport;