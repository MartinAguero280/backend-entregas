import mongoose from "mongoose";

// Nombre de la coleccion
const cartsCollection = 'carts';

// Esquema del documento
const cartsSchema = new mongoose.Schema({
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

cartsSchema.pre('find', function() {
    this.populate('products.product')
});


// Creacion del modelo. Collection + Schema
export const cartsModel = mongoose.model(cartsCollection, cartsSchema);