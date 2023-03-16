import { generateRandomString } from "../../utils.js";

export default class ProductDTO {

    constructor(product) {
        this.title = product.title || ''
        this.description = product.description || ''
        this.price = product.price || 0
        this.code = generateRandomString()
        this.stock = product.stock || 0
        this.status = product.stock > 0 ? true : false
        this.category = product.category || ''

        this.active = true
    }

}