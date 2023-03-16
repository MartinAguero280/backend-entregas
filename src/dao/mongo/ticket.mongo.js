import { ticketModel } from "./models/ticket.model.js";

export default class ticketMongo {
    constructor() {};
    
    create = async (u) => {
        return ticketModel.create(u)
    }

    find = async () => {
        return ticketModel.find();
    }

    findOne = async (u) => {
        return ticketModel.findOne(u);
    }

    findById = async (id) => {
        return ticketModel.findById(id)
    }
}