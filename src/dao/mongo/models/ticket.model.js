import mongoose from "mongoose";

// Nombre de la coleccion
const ticketCollection = 'tickets';

// Esquema del documento
const ticketSchema = new mongoose.Schema({
    code: String,
    purchase_datetime: Date,
    amount: Number,
    purchaser: String

});

// Creacion del modelo. Collection + Schema
export const ticketModel = mongoose.model(ticketCollection, ticketSchema);