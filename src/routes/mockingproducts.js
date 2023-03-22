// Express
import express from "express";
// Generate Product
import { generateProduct } from "../utils.js";


const router = express.Router();


router.get("/", async (req, res) => {
    let user = [];
    for (let i = 0; i < 100; i++) {
        user.push(generateProduct());
    }

    res.send({ status:'success', payload: user });
});


export default router

