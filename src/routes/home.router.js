import express from "express";
import { passportCall } from "../utils.js";

const router = express.Router();

router.get('/', passportCall('jwt'), async (req, res) => { 
    //if (req.session?.user) return res.render('home');
    return res.redirect('sessions/login')
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

router.get('/chat', (req, res) => {
    res.render('chat');
});


export default router