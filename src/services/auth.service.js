'use strict'

const asyncHandler = require('../utils/asyncHandler')
const {sendSuccess, sendCreated} = require('../utils/apiResponse')
const ApiError = require('../utils/ApiError')
const {signToken} = require('../utils/jwt')
const User = require('../models/user.model')


async function createUser(data) {
    // req.body leaves und when no readable body, we're destructuring the vals that should be in req, turns bad errs into returned 400
    // we have to destructure instead of just using req.body because users could add malicious fields, additional guards for ownerId
    const {name, email, password} = data ?? {}

    const user = await User.create({name, email, password})

    return user
}

async function loginUser(data) {
    const {email, password} = data ?? {}
    if (!email || !password) {
        throw ApiError.badRequest('email and password are required')
    }

    // .select('+password') overrides schema that select:false for just this query, comparing the hash is the goal
    const user = await User.findOne({email:String(email).toLowerCase().trim()}).select('+password')
    if (!user || !(await user.comparedPassword(password))) {
        throw ApiError.unauthorized('Invalid email or password')
    }
}


module.exports = {createUser, loginUser}