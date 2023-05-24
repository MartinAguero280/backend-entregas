import express from "express";
import { requireRole } from "../utils.js";
import UserController from "../controllers/user.controller.js";
import CartController from "../controllers/cart.controller.js";



const router = express.Router();
const User = new UserController();
const Cart = new CartController();


router.get('/api/users', requireRole('admin'), async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).send({users});
    } catch (error) {
        return res.status(500).send({error:"Error al traer los usuarios"});
    }
});

router.get('/users', requireRole('admin'), async (req, res) => { 
    try {
        const users = await User.find();
        return res.status(200).render('users/users', {users});
    } catch (error) {
        return res.status(500).send({error:"Error al traer los usuarios"});
    }
});

router.delete('/api/users', requireRole('admin'), async (req, res) => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const result = await User.deleteMany({ last_connection: { $lte: twoDaysAgo } });
        if (result.deletedCount > 0) {
            return res.status(200).send({ message: `${result.deletedCount} usuarios eliminados.` });
        }
        return res.status(200).send({ message: 'No hay usuarios cuya última conexión sea anterior a la fecha de dos días atrás' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.delete("/api/users/:id", requireRole('admin'), async (req, res) => {
    try {

        const {id} = req.params;
        const userRole = req.query.userRole
        const userCart = req.query.userCart

        if (userRole === 'admin') {
            res.status(500).send({status: 'error', error: 'No se pueden eliminar usuarios con role: admin'})
        }

        const userDeleted = await User.deleteOne({_id: id});
        const cartUserDeleted = await Cart.deleteOne({_id: userCart});

        if (userDeleted.deletedCount !== 1) {
            return res.status(400).send({status: "error", error: "Error al eliminar usuario"})
        }

        return res.status(200).send({status: 'succes'})

    } catch (error) {
        console.log(error);
        return res.status(400).send({status: "error", error: "Error al eliminar usuario"})
    }
});

router.put("/api/users/:id/:newroleuser", requireRole('admin'), async (req, res) => {
    try {

        const {id} = req.params
        const newRoleUser = req.params.newroleuser;
        const userRole = req.query.userRole;

        if (userRole === 'admin') {
            res.status(500).send({status: 'error', error: 'No se puede cambiar el role de usuarios con role: admin'})
        }

        const roleUpdated = await User.updateOne({_id: id}, {$set: {role: newRoleUser}});

        if (roleUpdated.modifiedCount !== 1) {
            return res.status(400).send({status: "error", error: "Error al actualizar rol de usuario"})
        }

        return res.status(200).send({status: 'succes'})

    } catch (error) {
        return res.status(400).send({status: "error", error: "Error al actualizar rol de usuario"})
    }
});

export default router