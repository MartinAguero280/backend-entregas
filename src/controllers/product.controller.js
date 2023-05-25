import { ProductService } from "../repositories/index.js";
import nodemailer from 'nodemailer'

export default class ProductController {
    constructor() {
        this.ProductService = ProductService;
    }

    create = async (u) => {
        return this.ProductService.create(u)
    }

    find = async (c) => {
        return this.ProductService.find(c);
    }

    findOne = async (c) => {
        return this.ProductService.findOne(c);
    }

    findById = async (id) => {
        return this.ProductService.findById(id)
    }

    save = async () => {
        return this.ProductService.save();
    }

    findOneAndUpdate = async (condition, newValor, options) => {
        return this.ProductService.findOneAndUpdate(condition, newValor, options);
    }

    deleteOne = async (condition) => {
        return this.ProductService.deleteOne(condition);
    }

    updateOne = async (c, pU) => {
        return this.ProductService.updateOne(c, pU);
    }

    paginate = async(search, options) => {
        return this.ProductService.paginate(search, options)
    }

    productsPaginate = async (req, res) => {
        try {
            const page = req.query?.page || 1;
            const limit = req.query?.limit || 10;
            const filter = req.query?.query || "";
            const sort = req.query?.sort || "";
            const search = {};
            const options = {page, limit, lean: true};

            if (filter) {
                search["$or"] = [
                    {category: {$regex: filter}},
                    {title: {$regex: filter}},
                ]
            }

            if (sort) {
                if (sort == "asc") {
                    const result = await ProductService.paginate({}, { sort:{ price: 1 } });
                    return res.send({ result })
                }else if (sort == "desc") {
                    const result = await ProductService.paginate({}, { sort:{ price: 1 } });
                    return res.send({ result })
                }
            };

            const result = await ProductService.paginate(search, options);

            if (!result) {
                return result
            }

            result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&query=${filter}&sort=${sort}` : "";
            result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&query=${filter}&sort=${sort}` : "";
            result.isValid = !(page <= 0 || page > result.totalPages || isNaN(page));
            result.user = req.user.user;
            result.accessToCreateProducts = req.user.user.role === 'admin' || req.user.user.role === 'premium';
            result.adminAccess = req.user.user.role === 'admin';

            return result
        } catch (error) {
            return error
        }
    }

    emailDeleteProduct = async (product) => {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: 'mail admin',
                pass: 'pass'
            }
        })

        const mail = await transport.sendMail({
            from: 'mail admin',
            to: req.user.user.email,
            subject: 'ManoniMotoRep Tienda Online',
            html: `
                <div>
                    <h1>BackEnd ecommerce</h1>

                    <h2>Aviso</h2>

                    <h3>Su producto que lleva como nombre ${product.title} a sido eliminado</h3>

                </div>
            `,
            attachments: []
        })
    }


}