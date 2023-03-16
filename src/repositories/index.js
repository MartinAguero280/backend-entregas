// Factory
import { User, Product, Ticket, Cart } from "../dao/factory.js";
// Repositories
import UserRepository from "./user.repository.js";
import ProductRepository from "./product.repository.js";
import TicketRepository from "./ticket.repository.js";
import CartRepository from "./cart.repository.js";


// Export service
export const UserService = new UserRepository(new User());
export const ProductService = new ProductRepository(new Product());
export const TicketService = new TicketRepository(new Ticket());
export const CartService = new CartRepository(new Cart());