const Observation = require('../models/observation.js')
const ApiError = require('../utils/ApiError.js')

let nextId = 0


async function findAll() {
    return await Observation.find({})
}

async function findOne(id) {
    const obsv = await Observation.find({id:id})
    if (!obsv) throw new ApiError(404, "Observation not found")
    return obsv
}

async function create(data) {
    return Observation.create({id:String(nextId++), ...data})
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

async function remove(id) {
    const obsv = await Observation.findOneAndDelete({id:id})
    if (!obsv) throw new ApiError(404, 'Observation not found')
    return obsv
}


module.exports = {findAll, findOne, create, replace, update, remove}