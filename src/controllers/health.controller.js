'use strict'

const {sendSuccess} = require('../utils/apiResponse.js')
const healthService = require('../services/health.service')


function health(req, res) {
    const health = healthService.getHealth()
    sendSuccess(res, health)
}

/** doesnt live in /api/v1 because its not apart of the api itself
 * used to maintain admin dashboard tools, public downdetector
 * same tech/func used to create an internet deadman switch
 */
module.exports = {health}