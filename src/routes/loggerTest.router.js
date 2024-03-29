import express from "express";
import { requireRole } from "../utils.js";

const router = express.Router();

router.get('/', requireRole('user', 'premium'), async (req, res) => { 

    req.logger.fatal('Testing FATAL ERROR')
    req.logger.error('Testing ERROR')
    req.logger.warning('Testing WARNING')
    req.logger.info('Testing INFO')
    req.logger.http('Testing HTTP')
    req.logger.debug('Testing DEBUG')

    res.status(200).send({message: 'Logger testing'})

});

export default router