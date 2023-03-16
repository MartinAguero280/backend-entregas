import { CartService } from "../repositories/index.js";

export default class CartController {
    constructor() {
        this.CartService = CartService;
    }

    create = async (cart) => {
        return this.CartService.create(cart)
    }

    find = async (c) => {
        return this.CartService.find(c);
    }

    findOne = async (c) => {
        return this.CartService.findOne(c);
    }

    findById = async (id) => {
        return this.CartService.findById(id)
    }

    replaceOne = async (condition, object) => {
        return this.CartService.replaceOne(condition, object)
    }

    updateOne = async (condition, object) => {
        return this.CartService.updateOne(condition, object)
    }


}