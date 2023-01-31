import mongoose from "mongoose";

// Nombre de la coleccion
const sessionsCollection = 'users';

// Esquema del documento
const sessionsSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Creacion del modelo. Collection + Schema
export const sessionsModel = mongoose.model(sessionsCollection, sessionsSchema);