import UsersService from "../service/users.service.js";

class UsersController {
    constructor() {
        this.usersService = new UsersService();
    }

    create = async (u) => {
        return this.usersService.create(u)
    }

    find = async () => {
        return this.usersService.find();
    }

    findOne = async (c) => {
        return this.usersService.findOne(c);
    }

    findById = async (id) => {
        return this.usersService.findById(id)
    }
}

export default UsersController