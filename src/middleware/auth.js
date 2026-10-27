'use strict'

const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const {verifyToken} = require('../utils/jwt')
const {AUTH} = require('../config/constants')
const User = require('../models/user.model')

/** requires a user to be logged in
 * 
 * this middleware attaches verification and requires it for every req
 * runs before controller funcs on protected routes so by the time it runs, req.user is guarenteed to be real, and controllers won't check for themselves
 * 
 * users will send authed bearer token (signed jwt)
 * wrapped in asyncHandler because it needs to await db res, w/o it, instant 500
 */

const requireAuth = asyncHandler(async (req, res, next) => {
    const header = req.get('authorization')

    if (!header || !header.startsWith(AUTH.BEARER_PREFIX)) {
        throw ApiError.unauthorized('Missing or malformed authorization header')
    }

    const token = header.slice(AUTH.BEARER_PREFIX.length).trim()
    // throws 401 on forged, expired, or garbage tok
    if (!token) throw ApiError.unauthorized('Missing or malformed Authorization header')
    
    const payload = verifyToken(token)

    const user = await User.findById(payload.sub)
    if (!user) throw ApiError.unauthorized('This account no longer exists')
    
    /** user is loaded instead of trusting the payload because tok stays valid until expiration, so the acc could've been deleted/changed since tok was issued
     * lookup is the moment we check that they exist rn
     * controller also gets a real doc from the db, not just an id
     */
    req.user = user
    next()
})

module.exports = {requireAuth}