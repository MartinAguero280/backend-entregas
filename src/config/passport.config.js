
import passport from 'passport';
import local from 'passport-local';
import { sessionsModel } from '../dao/models/sessions.model.js';
import { encryptPassword, comparePassword } from '../routes/sessions.router.js';


const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        {
            passReqToCallback: true, usernameField: 'email'
        },
        async (req, username, password, done) => {


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

    passport.serializeUser((user, done) => {
        done(null,user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await sessionsModel.findById(id);
        done(null, user)
    })
};

export default initializePassport;