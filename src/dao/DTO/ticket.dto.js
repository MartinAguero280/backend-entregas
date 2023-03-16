import { generateRandomString, getCreatedAt } from "../../utils.js";

export default class TicketDTO {

    constructor(ticket) {
        this.code = generateRandomString()
        this.purchase_datetime = getCreatedAt()
        this.amount = ticket.amount || 0
        this.purchaser = ticket.purchaser

        this.active = true
    }

}