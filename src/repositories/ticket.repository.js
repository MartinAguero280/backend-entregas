import TicketDTO from "../dao/DTO/ticket.dto.js";

export default class TicketRepository {

    constructor(dao) {
        this.dao = dao
    }

    find = async () => {
        const result = await this.dao.find();

        return result
    }

    create = async (t) => {
        const ticketToInsert = new TicketDTO(t);
        const result = await this.dao.create(ticketToInsert);
        
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

}