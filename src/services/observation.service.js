const crypto = require('crypto')
const Observation = require('../models/observation.js')
const ApiError = require('../utils/ApiError.js')
const {cloudName, cloudinaryKey, cloudinarySecret} = require('../config/env.js')


let nextId = 0


async function deleteImage(p) {
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = crypto
    .createHash("sha1")
    .update(`public_id=${p.publicId}&timestamp=${timestamp}${cloudinarySecret}`)
    .digest("hex");

    const reqBody = new FormData()
    reqBody.append("public_id", p.publicId)
    reqBody.append("timestamp", timestamp)
    reqBody.append("api_key", cloudinaryKey)
    reqBody.append("signature", signature)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method:"POST",
        body:reqBody
    })
    if (!res.ok) throw new ApiError(500, "Failed to delete image from Cloudinary")
}

async function findAll() {
    return await Observation.find({})
}

async function findOne(id) {
    if (!/^-?\d+$/.test(id)) throw new ApiError(400, "ID must be a number")
    const obsv = await Observation.findOne({id:id})
    if (!obsv) throw new ApiError(404, "Observation not found")

    return obsv
}

async function create(data) {
    const newObsv = new Observation({id:String(nextId++), ...data})
    // TODO: show what fields are missing
    try {await newObsv.validate()} catch {throw new ApiError(400, "Request missing required fields")}
    if (Observation.findOne({user:data.user, species:data.species, location:data.location, time:data.time})) throw new ApiError(409, "Duplicate observation")
    await newObsv.save()

    return newObsv
}

async function replace(user, id, data) {
    if (!user) throw new ApiError(401, 'Unauthorized Request')
    const userObj = JSON.parse(user)

    const obsv = await Observation.findOneAndReplace({id:id}, data)
    if (!obsv) throw new ApiError(404, 'Observation not found')
    if (userObj.name != obsv.user.name || userObj.uid != obsv.user.uid) throw new ApiError(403, "You do not own this observation")
    
    await Promise.all(data.photos.map(async p => {if (!obsv.photos.includes(p)) await deleteImage(p)}))

    return obsv
}

async function update(user, id, data) {
    if (!user) throw new ApiError(401, 'Unauthorized Request')
    const userObj = JSON.parse(user)

    const obsv = await Observation.findOneAndUpdate({id:id}, data)
    if (!obsv) throw new ApiError(404, 'Observation not found')
    if (userObj.name != obsv.user.name || userObj.uid != obsv.user.uid) throw new ApiError(403, "You do not own this observation")

    if (Object.hasOwn(data, "photos")) await Promise.all(data.photos.map(async p => {if (!obsv.photos.includes(p)) await deleteImage(p)}))
        
    return obsv
}

async function remove(user, id) {
    if (!user) throw new ApiError(401, 'Unauthorized Request')
    const userObj = JSON.parse(user)

    const obsv = await Observation.findOneAndDelete({id:id})
    if (!obsv) throw new ApiError(404, 'Observation not found')
    if (userObj.name != obsv.user.name || userObj.uid != obsv.user.uid) throw new ApiError(403, "You do not own this observation")

    // delete image in cloudinary
    await Promise.all(obsv.photos.map(async p => await deleteImage(p)))

    return obsv
}


module.exports = {findAll, findOne, create, replace, update, remove}