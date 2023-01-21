import express from "express";

const router = express.Router();

router.get('/', async (req, res) => { 
    res.render('home')
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

router.get('/chat', (req, res) => {
    res.render('chat');
});


export default router