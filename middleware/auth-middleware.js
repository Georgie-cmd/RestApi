const ApiError = require('../errors/api-error')
const tokenService = require('../service/token-service')

module.exports = function(req, res, next) {
    try {
    /* This is checking if the request has an authorization header. If it doesn't, it will return an error */
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }

    /* This is checking if the token is valid. If it is not valid, it will return an error */
        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken) {
            return next(ApiError.UnauthorizedError())
        }

    /* This is checking if the token is valid. If it is not valid, it will return an error */
        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData) {
            return next(ApiError.UnauthorizedError())
        }
        req.user = userData //setting property to the user data that was returned from the `tokenService.validateAccessToken` function
        next() //calling the next middleware in the middleware stack
    } catch(err) {
        return next(ApiError.UnauthorizedError())
    }
}