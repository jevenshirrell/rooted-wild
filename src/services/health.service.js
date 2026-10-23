'use strict'

const {isConnected} = require('../config/database.js')


function getHealth() {
    return {
        status: 'ok',
        database:isConnected() ? 'connected': 'disconnected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    }
}


module.exports = {getHealth}