const {connectDatabase, disconnectDatabase} = require('./config/database.js')
const {port} = require('./config/env.js')
const app = require('./app.js')


async function start() {
    await connectDatabase()
    const server = app.listen(port, () => console.log(`Listening on http://localhost:${port}`))
}
start()

async function stops() {
    await disconnectDatabase()   
}