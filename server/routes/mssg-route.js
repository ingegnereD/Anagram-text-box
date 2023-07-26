const express = require('express')
const router = express.Router()
const { sendMessage } = require("../controllers/mssg-controller")
const tokenDecoder = require('../middleware/authMiddleware')

router.route("/sendmessage").post(tokenDecoder, sendMessage)

module.exports = router