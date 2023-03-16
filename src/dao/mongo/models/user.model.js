import mongoose from "mongoose";
// Utils
import { comparePassword } from "../../../utils.js";
// Config
import { adminEmail, adminPassword } from '../../../config/config.js'


// Nombre de la coleccion
const usersCollection = 'users';

// Esquema del documento
const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    cart: {
        type: Array,
        default: []
    },
    role: {
        type: String,
        default: 'user'
    }

});


// Condicional de roles
usersSchema.pre('save', function(next) {
    if (this.email === adminEmail && comparePassword(adminPassword, this.password)) {
        this.role = 'admin';
    }
    next();
});

// Creacion del modelo. Collection + Schema
export const userModel = mongoose.model(usersCollection, usersSchema);