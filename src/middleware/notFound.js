const ApiError = require('../utils/ApiError.js')

module.exports = (req, res, next) => {
    const err = new ApiError(404, "Route not found")

    next(err)
}