const asyncHandler = require("express-async-handler")
const { StatusCodes } = require('http-status-codes')
const Mssg = require('../model/mssg-model')
const Chat = require('../model/chat-model')
const User = require('../model/user-model')


const sendMessage = asyncHandler(async(req, res) => {
    const { content, chatId } = req.body
    if (!content || !chatId) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please fill all fields" })
    }
    var message = await Mssg.create({
        content: content,
        sender: req.userInfo.id,
        chat: chatId
    })

    message = await message.populate("sender", "name userName email picture")
    message = await message.populate("chat")
    message = await User.populate(message, {
        path: "chat.users",
        select: "name userName email picture"
    })

    await Chat.findByIdAndUpdate({ _id: message._id }, { latestMessage: message })
        .populate("users", "-passsword")
        .populate("groupAdmin", "-password")

    res.status(StatusCodes.OK).json({ message })


})


const allMessages = asyncHandler(async(req, res) => {

})



module.exports = { sendMessage, allMessages }