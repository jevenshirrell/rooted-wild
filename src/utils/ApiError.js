'use strict';

class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message)

        this.statusCode = statusCode
        this.details = details
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }

    /** Stage 2: fix all static shortcuts and create proper error funcs
     * 
     * static req that expand the type of errs and res middleware can be used for
     * 
     * these routes will be set as a basis for stage 3 as well
     */
    // 400: wrong formatting
    static badRequest(message = 'Bad Request', details = null) {
        return new ApiError(400, message, details)
    }

    // 401: unauthorized, log in and try again
    static unauthorized(message = 'Unauthorized', details = null) {
        return new ApiError(401, message, details)
    }
    
    // 403: authorized, no perms
    // for stage 3 this will be a per record permission
    static forbidden(message = 'Forbidden', details = null) {
        return new ApiError(403, message, details)
    }
    
    // 404: not found
    static notFound(message = 'Not Found', details = null) {
        return new ApiError(404, message, details)
    }
    
    // 409: valid req, conflicts with the current plant
    static conflict(message = 'Conflict', details = null) {
        return new ApiError(409, message, details)
    }
}

module.exports = ApiError