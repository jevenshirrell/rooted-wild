module.exports = async (req, res, next) => {
    const start = Date.now()
    res.on("finish", () => {
        console.log("METHOD: ", req.method)
        console.log("PATH: ", req.originalUrl)
        console.log("STATUS: ", res.statusCode)
        console.log("LENGTH: ", `${Date.now() - start} ms`)
        console.log("=".repeat(50))
    })
    next()
}