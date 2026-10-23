'use strict'

const { isProduction } = require("../config/env")

/**
 * global error handler
 * each error will have 4 params
 * express ids error middleware by priority and 4th param
 * 
 * make sure: eslint-disable-next-line no-unused-vars
 */

module.exports = function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500
    let message = err.message || 'Internal server error'
    let details = err.details || null

    // in case the obj is wrong in path param, - client error not server
    if (err.name === 'CastError') {
        statusCode = 400
        message = `Invalid ${err.path}: ${err.value}`
    }

    // in case schema validation fails
    if (err.name === 'ValidationError') {
        statusCode = 400
        message = "Validation failed"
        details =Object.values(err.errors).map(error => ({
            field:error.path,
            message:error.message
        }))
    }

    // in case the uid is not unique, shows up as driver error because unique is an index not validator
    if (err.code === 11000) {
        statusCode = 409
        message = `Duplicate value for: ${Object.keys(err.keyValue || {}).join(', ')}`
    }

    // in cse the json req structure is wrong
    if (err.type === 'entity.parse.failed') {
        statusCode = 400
        message = 'Malformed JSON in request body'
    }

    // in case body is larger than size limit
    if (err.type === 'entity.too.large') {
        statusCode = 413
        message = 'Request body too large'
    }

    if (statusCode >= 500) console.error('[error]', {message: err.message, stack: err.stack})

    res.status(statusCode).json({
        success:false,
        error: {
            message,
            ...(details && {details}),
            // the err.stack exposes file paths and dependency versions
            // for devs only, will no longer show in prod
            ...(!isProduction && statusCode >= 500 && {stack: err.stack})
        }
    })
}