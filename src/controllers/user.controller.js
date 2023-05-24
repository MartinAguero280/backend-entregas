import { UserService } from "../repositories/index.js";

export default class UserController {
    constructor() {
        this.UserService = UserService;
    }

    create = async (u) => {
        return this.UserService.create(u)
    }

    find = async () => {
        return this.UserService.find();
    }

    findOne = async (c) => {
        return this.UserService.findOne(c);
    }

    findById = async (id) => {
        return this.UserService.findById(id)
    }

    updateOne = async (...c) => {
        return this.UserService.updateOne(...c)
    }

    deleteMany = async (...c) => {
        return this.UserService.deleteMany(...c)
    }

    deleteOne = async (...c) => {
        return this.UserService.deleteOne(...c)
    }

}
