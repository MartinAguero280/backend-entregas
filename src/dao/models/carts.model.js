import mongoose from "mongoose";

// Nombre de la coleccion
const cartsCollection = 'carts';

// Esquema del documento
const cartsSchema = new mongoose.Schema({

    products: []

});
// Creacion del modelo. Collection + Schema
export const cartsModel = mongoose.model(cartsCollection, cartsSchema)