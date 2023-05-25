import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
    req.logger.error(error.cause);
    switch(error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.send({status: "error", error: error.name})
            break
        default:
            res.send({status: "error", error: "Unhandled error"})
    }
}