import { TicketService } from "../repositories/index.js";

export default class TicketController {
    constructor() {
        this.TicketService = TicketService;
    }

    create = async (u) => {
        return this.TicketService.create(u)
    }

    find = async () => {
        return this.TicketService.find();
    }

    findOne = async (c) => {
        return this.TicketService.findOne(c);
    }

    findById = async (id) => {
        return this.TicketService.findById(id)
    }
}