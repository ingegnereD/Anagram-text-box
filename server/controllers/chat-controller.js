const asyncHandler = require('express-async-handler')
const Chat = require('../model/chat-model')
const User = require('../model/user-model')
const { StatusCodes } = require('http-status-codes')

const singleChat = asyncHandler(async(req, res) => {
    const { userId } = req.body
    if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please enter field' })
    }
    //check if a chat exists between the users
    var chatExists = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: userId } } },
                { users: { $elemMatch: { $eq: req.userInfo.id } } }
            ]
        })
        .populate("latestMessage")
        .populate("users", "-password")
        .populate("chatName", "userName")
        .populate("chatPicture", "picture")
    chatExists = await User.populate(chatExists, {
        path: "latestMessage.sender",
        select: "name userName email picture"
    })
    if (chatExists.length > 0) {
        res.status(StatusCodes.OK).json({ note: "chat already exists", chat: chatExists[0] })
    } else {
        // creating chat if it doesn't exist
        const createChat = await Chat.create({
            chatName: userId,
            chatPicture: userId,
            isGroupChat: false,
            users: [req.userInfo.id, userId]
        })

        var fetchChat = await Chat.findOne({ _id: createChat._id })
            .populate("users", "-password")
            .populate("chatName", "userName")
            .populate("chatPicture", "picture")

        res.status(StatusCodes.OK).json({ msg: "fetching chat...", chat: fetchChat })
    }
})

const fetchChat = asyncHandler(async(req, res) => {
    var findChat = await Chat.find({
            users: { $elemMatch: { $eq: req.userInfo.id } }
        })
        .populate("latestMessage")
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        // .populate({ path: "chatName", match: { chatName: { $ne: "Iroegbus" } } })
        // .populate("chatPicture", "picture")

    findChat = await User.populate(findChat, {
        path: "latestMessage.sender",
        select: "name userName email picture"
    })

    res.status(StatusCodes.OK).json({ nbHit: findChat.length, chat: findChat })

})

const groupChat = asyncHandler(async(req, res) => {
    if (!req.body.groupName || !req.body.groupMember) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please fill all fields" })
    }
    const groupMember = req.body.groupMember
    if (groupMember.length < 1) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "You need to have at least a person in your group" })
    }
    groupMember.push(req.userInfo.id)

    const createGroup = await Chat.create({
        chatName: req.body.groupName,
        isGroupChat: true,
        groupAdmin: req.userInfo.id,
        users: groupMember,
    })

    const fetchGroup = await Chat.findOne({ _id: createGroup._id })
        .populate("groupAdmin", "-password")
        .populate("users", "-password")

    res.status(StatusCodes.OK).json(fetchGroup)

})

const updateGroupName = asyncHandler(async(req, res) => {
    const { id: groupId } = req.params
    const { chatName } = req.body
    if (!groupId) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "Provide the chat ID" })
    }
    const chageGrpName = await Chat.findOneAndUpdate({ _id: groupId }, { chatName }, { new: true, runValidators: true })
        .populate("groupAdmin", "-password")
        .populate("users", "-password")
    if (!chageGrpName) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "Unable to change group name" })
    }
    res.status(StatusCodes.OK).json(chageGrpName)
})

const updateGroupPicture = asyncHandler(async(req, res) => {
    // const { id: groupId } = req.params
    // const { chatPicture } = req.body
    // if (!groupId) {
    //     res.status(StatusCodes.BAD_REQUEST).json({ msg: "Provide the chat ID" })
    // }
    // const chageGrpPicture = await Chat.findOneAndUpdate({ _id: groupId }, { chatPicture }, { new: true, runValidators: true })
    //     .populate("groupAdmin", "-password")
    //     .populate("users", "-password")
    // if (!chageGrpPicture) {
    //     res.status(StatusCodes.BAD_REQUEST).json({ msg: "Unable to change group name" })
    // }
    // res.status(StatusCodes.OK).json(chageGrpPicture)
})

const deleteChat = asyncHandler(async(req, res) => {
    const { id: chatId } = req.params
    if (!chatId) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "Chat ID not found" })
    }
    const deleteChat = await Chat.findOneAndDelete({ _id: chatId })
    if (!deleteChat) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "Unable to delete chat, check id" })

    }
    res.status(StatusCodes.OK).json({ msg: `Chat with id ${chatId} deleted successfully.`, chat: deleteChat })
})

module.exports = { singleChat, fetchChat, deleteChat, groupChat, updateGroupName, updateGroupPicture }