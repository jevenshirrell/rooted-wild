'use strict'

/** Everything JWT and toke will touch this file
 * logins/outs, auths, etc.
 * 
 * JWT: Javascript Web Token
 *  an industry standard for securely sending info
 * 
 * 
 * why we use tokens instead of sessions
 * JWTs use 3 base64 chunks that w/ the secret + header (alg, typ) make it more secure
 * sessions can be interrupted
 * most major sites all use tokens, and push session reminders to the suer instead
 * increases overall security
 * 
 * 
 * @params {object} user
 * @returns {string} a signed token
 */

const jwt = require('jsonwebtoken')
const ApiError = require('../utils/ApiError')
const {jwtSecret, jwtExpiresIn} = require('../config/env')


function signToken(user) {
    /** 
     * sub (subject) is the standard jwt claim for who is this tok abt
     * keep payload tiny on purpose so users row can change at any time so the id is the only thing worth carrying in
     * we will worry about roles later when doing perm checks
     */
    const payload = {sub: String(user._id), role: user.role}

    return jwt.sign(payload, jwtSecret, {expiresIn:jwtExpiresIn})
}

/** Verify Token will given tok and handing it back
 * jwt library throws its own err types, use ApiError to translate
 * app will still work, this makes sure bad tok will become clean 401s, not server breaking 500s
 * 
 * @param {string} token
 * @param {{sub:string, role:string, iat:number, exp:number}}
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, jwtSecret)
    } catch (err) {
        /** this err covers forged sigs 
         * don't make res too detailed, or attackers can make a good enough forgery
        */
       throw ApiError.unauthorized('Invalid Token')
    }
}


module.exports = {signToken, verifyToken}