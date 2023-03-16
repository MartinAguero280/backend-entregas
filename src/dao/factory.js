import { persistence } from "../config/config.js";

export let User
export let Product
export let Ticket
export let Cart

switch (persistence) {
    case 'mongo':
        console.log('Mongo Connect');

        const { default: UserMongo } = await import('./mongo/user.mongo.js');
        const { default: ProductMongo } = await import('./mongo/product.mongo.js');
        const { default: TicketMongo } = await import('./mongo/ticket.mongo.js');
        const { default: CartMongo } = await import('./mongo/cart.mongo.js');

        User = UserMongo;
        Product = ProductMongo;
        Ticket = TicketMongo;
        Cart = CartMongo;

        break

    case 'file':
        console.log('Persistence with files');
        const { default: UserFile } = await import('./managers/UserManager.js');
        User = UserFile

        break

    default:
        console.log('Memory Persistence');
        const { default: UserMemory } = await import('./memory/user.memory.js');
        User = UserMemory

        break
}