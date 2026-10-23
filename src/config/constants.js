/**Client tags for sorting*/
const SORTABLE_FIELDS = Object.freeze([
    'createdAt', 'updatedAt', 'species', 'time'
])

const PAGINATION = Object.freeze({
    DEFAULT_PAGE:1, DEFAULT_LIMIT:20, MAX_LIMIT:100
})

const API_PREFIX = '/api/v1'

// stage 2: acc roles
const ROLES = Object.freeze({USER:'user', ADMIN:'admin', OWNER:'owner'})
const ROLE_VALUES = Object.freeze(Object.values(ROLES))

// stage 2: auth
const AUTH = Object.freeze({
    // when using encryption, salting refers to how complex the encryption will be, but also plays a role in how long de/reencryption will take
    // high numbers is not good for performance, anything over 15 rounds is too much 
    SALT_ROUNDS:10,
    DEFAULT_JWT_EXPIRES_IN:'7d',
    BEARER_PREFIX:'Bearer'
})
const DEFAULT_SORT = Object.freeze({createdAt: -1})


module.exports = {
    // stage 1
    SORTABLE_FIELDS, PAGINATION, API_PREFIX,
    // stage 2
    ROLES, ROLE_VALUES, AUTH, DEFAULT_SORT
}