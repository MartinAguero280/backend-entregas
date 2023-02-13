import mongoose from "mongoose";

// Nombre de la coleccion
const sessionsCollection = 'users';

// Esquema del documento
const sessionsSchema = new mongoose.Schema({
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
sessionsSchema.pre('save', function(next) {
    if (this.email === 'adminCoder@coder.com') {
        this.role = 'admin';
    }
    next();
});

// Creacion del modelo. Collection + Schema
export const sessionsModel = mongoose.model(sessionsCollection, sessionsSchema);