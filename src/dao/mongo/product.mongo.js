import { productModel } from "./models/product.model.js";

export default class ProductMongo {
    constructor() {};
    
    create = async (u) => {
        return await productModel.create(u)
    }

    find = async (c) => {
        return await productModel.find(c);
    }

    findOne = async (u) => {
        return await productModel.findOne(u);
    }

    findById = async (id) => {
        return await productModel.findById(id);
    }

    save = async () => {
        return await productModel.save();
    }

    findOneAndUpdate = async (condition, newValor, options) => {
        return await productModel.findOneAndUpdate(condition, newValor, options);
    }

    deleteOne = async (condition) => {
        return await productModel.deleteOne(condition);
    }

    paginate = async(search, options) => {
        return await productModel.paginate(search, options);
    }
}