import express from "express";
import { passportCall } from "../utils.js";

const router = express.Router();

router.get('/', passportCall('jwt'), async (req, res) => { 
    res.render('home')
});

router.get('/realtimeproducts',passportCall('jwt'), (req, res) => {
    res.render('products/realTimeProducts');
});

router.get('/chat',passportCall('jwt'), (req, res) => {
    res.render('chat');
});


export default router