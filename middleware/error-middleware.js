const ApiError = require("../errors/api-error")

module.exports = function(err, req, res, next) {
    console.log(err)
/* This is a way to catch errors that are thrown from the API. */
    if(err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: 'Unknown error...'})
}