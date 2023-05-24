import UserDTO from "../dao/DTO/user.dto.js"

export default class UserRepository {

    constructor(dao) {
        this.dao = dao
    }

    find = async () => {
        const result = await this.dao.find();
        return result
    }

    create = async (u) => {
        const userToInsert = new UserDTO(u);
        const result = await this.dao.create(userToInsert);

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

    updateOne = async (...c) => {
        const result = await this.dao.updateOne(...c);
        return result
    }

    deleteMany = async (...c) => {
        const result = await this.dao.deleteMany(...c);
        return result
    }

    deleteOne = async (...c) => {
        const result = await this.dao.deleteOne(...c);
        return result
    }

}