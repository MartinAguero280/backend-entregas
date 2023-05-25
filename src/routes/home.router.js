import express from "express";
import { requireRole } from "../utils.js";

const router = express.Router();

router.get('/', requireRole('user', 'premium'), async (req, res) => { 
    res.render('home/home')
});

router.get('/realtimeproducts', requireRole('user', 'premium'), (req, res) => {
    res.render('products/realTimeProducts');
});

router.get('/chat', requireRole('user', 'premium'), (req, res) => {
    res.render('chat/chat');
});


export default router