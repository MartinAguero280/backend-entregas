import { userModel } from "./models/user.model.js";

export default class UserMongo {
    constructor() {};
    
    create = async (u) => {
        return userModel.create(u)
    }

    find = async () => {
        return userModel.find();
    }

    findOne = async (u) => {
        return userModel.findOne(u);
    }

    findById = async (id) => {
        return userModel.findById(id)
    }
}

