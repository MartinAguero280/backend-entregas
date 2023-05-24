import { getCreatedAt } from "../../utils.js";

export default class UserDTO {

    constructor(user) {
        this.first_name = user.first_name || ''
        this.last_name = user.last_name || ''
        this.email = user.email || ''
        this.age = user.age || ''
        this.password = user.password || ''
        this.cart = user.cart || []
        this.role = user.role || 'user'
        this.last_connection = this.last_connection || getCreatedAt()

        this.active = true
    }

}
