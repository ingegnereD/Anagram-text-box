const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()
const { registerUser, authUser, getAllUser, findForgetPassUser, updateUserName, updatePicture } = require("../controllers/user-controller")

router.route("/signup").post(registerUser)
router.route("/login").post(authUser)
router.route("/").get(authMiddleware, getAllUser)
router.route("/forgetpass").patch(findForgetPassUser)
router.route("/update").patch(authMiddleware, updateUserName).patch(authMiddleware, updatePicture)

module.exports = router