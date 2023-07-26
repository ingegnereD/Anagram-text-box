const express = require('express')
const router = express.Router()
const { singleChat, fetchChat, deleteChat, groupChat, updateGroupName, updateGroupPicture } = require('../controllers/chat-controller')
const decodeToken = require("../middleware/authMiddleware")

router.route("/singlechat").post(decodeToken, singleChat)
router.route("/groupchat").post(decodeToken, groupChat)
router.route("/groupchat/:id").patch(updateGroupName)
router.route("/groupchat/:id").patch(updateGroupPicture)
router.route("/").get(decodeToken, fetchChat)
router.route("/removechat/:id").delete(deleteChat)

module.exports = router