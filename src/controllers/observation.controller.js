const asyncHandler = require('../utils/asyncHandler')
const obsvService = require('../services/observation.service.js')


const getAll = asyncHandler(async (req, res) => {
    const obsvs = await obsvService.findAll()
    res.status(200).json(obsvs)    
})

const getOne = asyncHandler(async (req, res) => {
    const obsv = await obsvService.findOne(req.params.id)
    res.status(200).json(obsv)
})

const create = asyncHandler(async (req, res) => {
    const obsv = await obsvService.create(req.body)
    res.status(201).json(obsv)
})

const replace = asyncHandler(async (req, res) => {
    const obsv = await obsvService.replace(req.params.id, req.body)
    res.status(200).json(obsv)
})

const update = asyncHandler(async (req, res) => {
    const obsv = await obsvService(req.params.id, req.body)
    res.status(200).json(obsv)
})

const remove = asyncHandler(async (req, res) => {
    const obsv = await obsvService.remove(req.params.id)
    res.status(204).send()
})

module.exports = {getAll, getOne, create, replace, update, remove}