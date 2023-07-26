const mongoose = require('mongoose')

//1. content 2.sender 3. chat
const messageSchema = new mongoose.Schema({
    content: { type: String, trim: true },
    sender: { type: mongoose.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Types.ObjectId, ref: "Chat" }
})

module.exports = mongoose.model("Message", messageSchema)