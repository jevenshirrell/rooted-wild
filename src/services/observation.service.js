const Observation = require('../models/observation.js')
const ApiError = require('../utils/ApiError.js')

let nextId = 0


async function findAll() {
    return await Observation.find({})
}

async function findOne(id) {
    if (!Number.isFinite(id)) throw new ApiError(400, "ID must be a number")
    const obsv = await Observation.findOne({id:id})
    if (!obsv) throw new ApiError(404, "Observation not found")
    return obsv
}

async function create(data) {
    const newObsv = new Observation({id:String(nextId++), ...data})
    // TODO: show what fields are missing
    try {await newObsv.validate()} catch {throw new ApiError(400, "Request missing required fields")}
    await newObsv.save()
    return newObsv
}

async function replace(id, data) {
    const obsv = await Observation.findOneAndReplace({id:id}, data)
    if (!obsv) throw new ApiError(404, 'Observation not found')
    return obsv
}

async function update(id, data) {
    const obsv = await Observation.findOneAndUpdate({id:id}, data)
    if (!obsv) throw new ApiError(404, 'Observation not found')
    return obsv
}

async function remove(user, id) {
    if (!user) throw new ApiError(401, 'Unauthorized Request')
    const userObj = JSON.parse(user)

    const obsv = await Observation.findOneAndDelete({id:id})
    if (!obsv) throw new ApiError(404, 'Observation not found')
    console.log(obsv.user)
    console.log(userObj)
    if (userObj.name == obsv.user.name && userObj.uid == obsv.user.uid) throw new ApiError(403, "You do not own this observation")
    return obsv
}


module.exports = {findAll, findOne, create, replace, update, remove}