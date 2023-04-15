import ProductDTO from "../dao/DTO/product.dto.js";

export default class ProductRepository {

    constructor(dao) {
        this.dao = dao
    }

    find = async (c) => {
        const result = await this.dao.find(c);

        return result
    }

    create = async (p) => {
        const productToInsert = new ProductDTO(p);
        const result = await this.dao.create(productToInsert);

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

    save = async () => {
        const result = await this.dao.save(search, options);

        return result
    }

    findOneAndUpdate = async (condition, newValor, options) => {
        const result = await this.dao.findOneAndUpdate(condition, newValor, options);

        return result
    }

    deleteOne = async (condition) => {
        const result = await this.dao.deleteOne(condition);

        return result
    }

    updateOne = async (c, pU) => {
        const result = await this.dao.updateOne(c, pU);

        return result
    }

    paginate = async(search, options) => {
        const result = await this.dao.paginate(search, options);

        return result
    }

}