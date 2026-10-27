'use strict'

const { PAGINATION, SORTABLE_FIELDS, DEFAULT_SORT, CLASS_VALUES } = require("../config/constants")
const ApiError = require('./ApiError')

/** serves as a platform for helper funcs
 * e.g. pagination, sorting, filtering
 * 
 * rn Observation.find({}) returns every observation, which is fine at small scale, but disastrous at large
 * 
 * by using pagination and req limits we can convert req value and use them for mongoos
 * 
 * @param {object} query req.query
 * @param {{page:number, limit:number, skip:number}}
 */

function parsePagination(query={}) {
    const rawPage = Number.parseInt(query.page, 10)
    const rawLimit = Number.parseInt(query.limit, 10)
    // req limits
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : PAGINATION.DEFAULT_PAGE

    let limit = Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : PAGINATION.DEFAULT_LIMIT
    if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT
    // skip is jow many docs the db skips before starting res
    // pg 1 skips 0, pg 2 skips 1 full limit, and so on
    return {page, limit, skip:(page - 1) * limit}
}

/** turns on sort, also making whitelist for sortable fields
 * this will TURN -> ?sort=-lastWateredAt, nickname --> {lastWateredAt: -1, nickname: 1}
 * 
 * this '-' means descending, matching the Mongoose syntax 
 * in stage 2 we are adding in fields that leak info, which is not the goal
 * whitelist allows us to not index these fields
 * 
 * @param {string} [sortParam] req.query.sort
 * @returns {object} a mongoose sort obj
 * @throws {ApiError} 400 when field not sortable
 */
function parseSort(sortParam) {
    if (!sortParam || typeof sortParam !== 'string') return {...DEFAULT_SORT}

    const sort = {}

    for (const rawField of sortParam.split(',')) {
        const field = rawField.trim()
        // if no other field end loop
        if (!field) continue
        const descending = field.startsWith('-')
        // name is of the field sorted by
        const name = descending ? field.slice(1) : field

        // checks to see if name exists in allowed list
        if (!SORTABLE_FIELDS.includes(name)) {
            throw ApiError.badRequest(`Cannot sort by '${name}'. Sortable fields: ${SORTABLE_FIELDS.join(', ')}`)
        }
        sort[name] = descending ? -1 : 1
    }
    // ?sort=,,, parses nothing so we fall back on our error handling rather than mongoose's
    return Object.keys(sort).length > 0 ? sort : {...DEFAULT_SORT}
}

/** everything the client needs to draw page 2 of 7 and wire up the next button is what meta is for
 * 
 * this adjusts alongside data rather than inside of it, user 'extra' arg, sendSuccess alr accepted in Stage 1, so a list response is now:
 *  {success, data, meta}
 * and alr existing records wont change
 * 
 * @param {{page:number, limit:number, total:number}} args
 */
function buildMeta({page, limit, total}) {
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0

    return {
        page, limit, total, totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    }
}
/**Escape user search from becomin liability
 * 
 * without the following func a search for "c++" or "(" would either crash regex or be read as a regex str
 * malicious users can stall event loop, known as denial of service (ddos) attack
 */
function escapeFunction(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** lastly observation filter func
 * lives in the file next to query helpers so controller stays on a short list for the $ of steps it has to take
 * ?status= ?location= ?q= (nick/species)
 * 
 * not including ?overDue as its a virtual func for the model
 * 
 * @param {object} query req.query
 * @return {object} a filter for Observation.find()
 * @throws {ApiError} 400 on a val that isn't allowed
 */
function buildObsvFilter(query={}) {
    let filter = {}

    if (query.class) {
        if (!CLASS_VALUES.includes(query.class)) {
            throw ApiError.badRequest(`'${query.class}' is not a supported class. Valid: ${CLASS_VALUES.join(', ')}`)
        }
        filter.class = query.class
    }
    if (query.q) {
        // 'i' makes the search case insensitive
        const pattern = new RegExp(escapeFunction(String(query.q).trim()), 'i')
        // $or checks both fields and keeps a observation that matches either
        filter = {species:pattern}
    }
    return filter
}


module.exports = {parsePagination, parseSort, buildMeta, escapeFunction, buildObsvFilter}