const mongoose = require('mongoose')
const {mongoUri} = require('./env')

let listenersAttached = false


function attachListeners() {
    // makes sure to exit if func alr ran
    if (listenersAttached) return;
    
    listenersAttached = true
    mongoose.connection.on('connected', () => {
        console.log(`MongoDB Connected: ${mongoose.connection.name}`)
    })
    mongoose.connection.on('error', () => {
        console.log(`MongoDB error: ${err.message}`)
    })
    mongoose.connection.on('disconnected', () => {
        console.log(`MongoDB disconnected`)
    })
}

async function connectDatabase(uri = mongoUri) {
    // strips query fields that aren't in schema, stops user input reaching an unintended query shape
    mongoose.set("strictQuery", true)
    attachListeners()

    try {
        await mongoose.connect(uri, {
            // failure to connect in 10s rather than hanging for def 30s, speeds up process and makes failures obvious
            serverSelectionTimeoutMS:10000
        })
    } catch (err) {
        console.log(`Couldn't connect to MongoDB: ${err.message}`)
        process.exit(1)
    }
}

async function disconnectDatabase() {
    await mongoose.connection.close()
}

function isConnected() {
    return mongoose.connection.readyState === 1
}

module.exports = {connectDatabase, disconnectDatabase, isConnected}