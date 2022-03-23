module.exports = class ApiError extends Error {
    status 
    errors 

/**
 * Creating an object with the given status, message, and errors
 * @param status - The HTTP status code
 * @param message - The error message
 * @param [errors] - An array of errors that occurred during the request
*/
    constructor(status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
        this.message = message 
    }

    //validation errors
/**
 * The `static` keyword is used to define a method that can be called without having to instantiate the class
 * @param message - The message to be displayed to the user
 * @param [errors] - An array of errors that will be returned to the client
 * @returns An ApiError object.
*/
    static regValidation(message, errors = []) {
        return new ApiError(404, message, errors)
    }

    //authorization errors
    static UnauthorizedError() {
        return new ApiError(401, 'User is not authorized...')
    }

    //other errors
    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }

    static internal(message) {
        return new ApiError(500, message)
    }

    static forbidden(message) {
        return new ApiError(403, message)
    }
}