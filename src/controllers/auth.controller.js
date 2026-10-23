'use strict'

/** Stage 2: register logins and report who you are */

const asyncHandler = require('../utils/asyncHandler')
const {sendSuccess, sendCreated} = require('../utils/apiResponse')
const authService = require('../services/auth.service')

/** Auth HTTP Handlers:
 * This will be the same shape as plant.controller, it will read req and lean on the model for rules and answer thru the shared res obj (not in the res body)
 */

// POST /ap/v1/auth/register
const register = asyncHandler(async (req, res) => {
    const user = await authService.createUser(req.body)
    // logging in the newly created user
    // after this the user data goes thru the schema validation, then toJSON func which dels had from the server
    sendCreated(res, {user, token: signToken(user)})
})

// POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
    const user = await authService.loginUser(req.body)

    sendSuccess(res, {user, token:signToken(user)})
})

// Get /api/v1/auth/me
const me = asyncHandler(async (req, res) => {
    // requireAuth will have alr verifies tok and loaded user settings/info, so use this endpoint so the client can confirm token validity. will also allow user to referesh pofile and tok
    sendSuccess(res, req.user)
})


module.exports = {register, login, me}