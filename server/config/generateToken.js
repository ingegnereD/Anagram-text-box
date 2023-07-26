const jwt = require('jsonwebtoken')

const generateToken = (id, name, email) => {
    return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

module.exports = generateToken