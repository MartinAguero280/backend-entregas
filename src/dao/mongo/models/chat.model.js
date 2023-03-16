import mongoose from "mongoose";

// Nombre de la coleccion
const chatCollection = 'chat';

// Esquema del documento
const chatSchema = new mongoose.Schema({user: String, message: String});

// Creacion del modelo. Collection + Schema
export const chatModel = mongoose.model(chatCollection, chatSchema)