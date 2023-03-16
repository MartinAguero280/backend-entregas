import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Nombre de la coleccion 
const productCollection = 'products';

// Esquema del documento
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: String,
    stock: Number,
    status: Boolean,
    category: String
});

//mongoose paginate
productSchema.plugin(mongoosePaginate);

// Creacion del modelo. Collection + Schema
export const productModel = mongoose.model(productCollection, productSchema)