// wrapper function for try/catch blocks (so we don't have to use them)
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
module.exports = asyncHandler