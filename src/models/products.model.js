import mongoose from "mongoose";

// Nombre de la coleccion
const productsCollection = 'products';

// Esquema del documento
const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: String,
    stock: Number,
    status: Boolean,
    category: String
});
// Creacion del modelo. Collection + Schema
export const productsModel = mongoose.model(productsCollection, productsSchema)