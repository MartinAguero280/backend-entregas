import CartDTO from "../dao/DTO/cart.dto.js";

export default class CartRepository {

    constructor(dao) {
        this.dao = dao
    }

    find = async (c) => {
        const result = await this.dao.find(c);

        return result
    }

    create = async (cart) => {
        const cartToInsert = new CartDTO(cart);
        const result = await this.dao.create(cartToInsert);

        return result
    }

    findOne = async (c) => {
        const result = await this.dao.findOne(c);

        return result
    }

    findById = async (id) => {
        const result = await this.dao.findById(id);

        return result
    }

    replaceOne = async (condition, object) => {
        const result = await this.dao.replaceOne(condition, object);

        return result
    }

    updateOne = async (condition, object) => {
        const result = await this.dao.updateOne(condition, object);

        return result
    }

    deleteOne = async (condition) => {
        const result = await this.dao.deleteOne(condition);

        return result
    }


}