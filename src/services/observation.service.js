'use strict';

const crypto = require('crypto')
const Observation = require('../models/observation.model.js')
const ApiError = require('../utils/ApiError.js')
const {cloudName, cloudinaryKey, cloudinarySecret} = require('../config/env.js')
const {parsePagination, parseSort, buildObsvFilter, buildMeta} = require('../utils/queryFeatures.js')

const WRITABLE_FIELDS = ['species', 'location', 'time', 'photos']


function pickWritableFields(body={}) {
    const payload = {}
    for (const field of WRITABLE_FIELDS) {
        if(body[field] !== undefined) payload[field] = body[field]
    }
    return payload
}

async function findAll(query) {
    const filter = buildObsvFilter(query)
    const sort = parseSort(query.sort)
    const {page, limit, skip} = parsePagination(query)

    // 2 queries run together rather than sequentially
    const [obsv, total] = await Promise.all([
        Observation.find(filter).sort(sort).skip(skip).limit(limit),
        Observation.countDocuments(filter)
    ])

    return [obsv, {meta:buildMeta({page, limit, total})}]
}

async function findOne(id) {
    const obsv = await Observation.findById(id)
    if (!obsv) throw ApiError.notFound("Observation not found")
    return obsv
}

async function create(data, userId) {
    // Challenge 6
    // if (Observation.findOne({species:data.species, location:data.location, time:data.time})) throw new ApiError(409, "Duplicate observation")
    
    const obsv = await Observation.create({
        ...pickWritableFields(data),
        ownerId:userId
    })

    return obsv
}

async function update(id, data) {
    const obsv = await Observation.findByIdAndUpdate(id, data, {
        new:true, runValidators:true
    })
    if (!obsv) throw ApiError.notFound('Observation not found')

    if (Object.hasOwn(data, "photos")) await Promise.all(data.photos.map(async p => {if (!obsv.photos.includes(p)) await deleteImage(p)}))
        
    return obsv
}

async function remove(id) {
    const obsv = await Observation.findByIdAndDelete(id)
    if (!obsv) throw ApiError.notFound('Observation not found')

    await Promise.all(obsv.photos.map(async p => await deleteImage(p)))

    return obsv
}

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
    if (!res.ok) throw new ApiError(500, "Failed to delete image")
    
    return res
}


module.exports = {findAll, findOne, create, update, remove}