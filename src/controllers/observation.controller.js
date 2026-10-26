'use strict';

const asyncHandler = require('../utils/asyncHandler')
const obsvService = require('../services/observation.service.js')
const {sendSuccess, sendCreated, sendNoContent} = require('../utils/apiResponse')


const getAll = asyncHandler(async (req, res) => {
    const [obsvs, meta] = await obsvService.findAll(req.query)
    sendSuccess(res, obsvs, 200, meta)
})

const getOne = asyncHandler(async (req, res) => {
    const obsv = await obsvService.findOne(req.params.id)
    sendSuccess(res, obsv)
})

const create = asyncHandler(async (req, res) => {
    const obsv = await obsvService.create(req.body, req.user._id)
    sendCreated(res, obsv)
})

const update = asyncHandler(async (req, res) => {
    const obsv = await obsvService.update(req.params.id, req.body)
    sendSuccess(res, obsv)
})

const remove = asyncHandler(async (req, res) => {
    const obsv = await obsvService.remove(req.params.id)
    sendNoContent(res)
})

module.exports = {getAll, getOne, create, replace, update, remove}