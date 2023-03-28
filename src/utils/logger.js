import winston from 'winston'
import { status } from '../config/config.js'

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
}

const statusError = ()=> {
    if (status === "desarrollo") return "debug";
    if (status === "producción") return "info";
    if (!status) return "debug"
}

const statusFile = ()=> {
    if (status === "desarrollo") return "";
    if (status === "producción") return "error";
    if (!status) return ""
}


const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({ 
            level: statusError(),
            format: winston.format.combine(
                winston.format.simple(),
            )
        }),
        
        new winston.transports.File({
            filename: './errors.log',
            level: statusFile(),
            format: winston.format.simple()
        })
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)

    next()
}