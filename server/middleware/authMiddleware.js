const jwt = require('jsonwebtoken')
const { StatusCodes } = require("http-status-codes")

const tokenDecoder = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(' ')[1]
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            const { id, name, email } = decode
            req.userInfo = { id, name, email }
            next()
        } catch (err) {
            res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Not authorized to access route" })
        }
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: "No token provided" })

    }
}

module.exports = tokenDecoder