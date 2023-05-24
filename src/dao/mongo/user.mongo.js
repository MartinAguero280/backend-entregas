import { userModel } from "./models/user.model.js";

export default class UserMongo {
    constructor() {};
    
    create = async (u) => {
        return userModel.create(u)
    }

    find = async () => {
        return userModel.find().lean();
    }

    findOne = async (u) => {
        return userModel.findOne(u);
    }

    findById = async (id) => {
        return userModel.findById(id)
    }

    updateOne = async (...c) => {
        return userModel.updateOne(...c)
    }

    deleteMany = async (...c) => {
        return userModel.deleteMany(...c)
    }

    deleteOne = async (...c) => {
        return userModel.deleteOne(...c)
    }

}

