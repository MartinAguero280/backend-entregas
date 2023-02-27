import { usersModel } from "../dao/models/users.model.js";

class UsersService {

    create = async (u) => {
        return usersModel.create(u)
    }

    find = async () => {
        return usersModel.find();
    }

    findOne = async (c) => {
        return usersModel.findOne(c);
    }

    findById = async (id) => {
        return usersModel.findById(id)
    }
}

export default UsersService