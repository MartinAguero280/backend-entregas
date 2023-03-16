import { ProductService } from "../repositories/index.js";

export default class ProductController {
    constructor() {
        this.ProductService = ProductService;
    }

    create = async (u) => {
        return this.ProductService.create(u)
    }

    find = async (c) => {
        return this.ProductService.find(c);
    }

    findOne = async (c) => {
        return this.ProductService.findOne(c);
    }

    findById = async (id) => {
        return this.ProductService.findById(id)
    }

    save = async () => {
        return this.ProductService.save();
    }

    findOneAndUpdate = async (condition, newValor, options) => {
        return this.ProductService.findOneAndUpdate(condition, newValor, options);
    }

    deleteOne = async (condition) => {
        return this.ProductService.deleteOne(condition);
    }

    paginate = async(search, options) => {
        return this.ProductService.paginate(search, options)
    }
}