import express from "express";

const router = express.Router();

router.get('/', async (req, res) => { 
    if (req.session?.user) return res.render('home');
    return res.redirect('sessions/login')
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

router.get('/chat', (req, res) => {
    res.render('chat');
});


export default router