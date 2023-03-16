import mongoose from "mongoose";

// Nombre de la coleccion
const cartCollection = 'carts';

// Esquema del documento
const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: Number
            }
        ],
        default: []
    }
});

cartSchema.pre('find', function() {
    this.populate('products.product')
});


// Creacion del modelo. Collection + Schema
export const cartModel = mongoose.model(cartCollection, cartSchema);