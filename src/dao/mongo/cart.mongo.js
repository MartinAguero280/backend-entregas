import { cartModel } from "./models/cart.model.js";

export default class CartMongo {
    constructor() {};
    
    create = async (u) => {
        return await cartModel.create(u)
    }

    find = async (c) => {
        return await cartModel.find(c).lean();
    }

    findOne = async (u) => {
        return await cartModel.findOne(u);
    }

    findById = async (id) => {
        return await cartModel.findById(id)
    }

    replaceOne = async (condition, object) => {
        return await cartModel.replaceOne(condition, object)
    }

    updateOne = async (condition, object) => {
        return await cartModel.updateOne(condition, object)
    }

    deleteOne = async (condition) => {
        return await cartModel.deleteOne(condition)
    }

}