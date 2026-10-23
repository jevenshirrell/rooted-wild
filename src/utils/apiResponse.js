'use strict'

/**
 * res envelope
 * 
 * every success res is {success: true, date, ...meta} and every error is {success:false, error{...}}} so that the clients will only need one parser for all reqs
 */
/**
*@param {import('express').Response} res
*@param {*} data
*@param {number} [statusCode=200]
*@param {object} [extra] // any other top level keys like meta
*/

function sendSuccess(res, data, statusCode = 200, extra={}) {
    return res.status(statusCode).json({success:true, data, ...extra})
}

// when a record is created
function sendCreated(res, data) {
    return sendSuccess(res, data, 201)
}

// if empty body
function sendNoContent(res) {
    return res.status(204).send()
}

module.exports = {sendSuccess, sendCreated, sendNoContent}

// remember this is to wrap the req in an "envelope" allowing us to use one parser to deal with all reqs