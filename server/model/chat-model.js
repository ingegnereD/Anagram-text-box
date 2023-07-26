const mongoose = require("mongoose")

//1. chatName 2. isGroupChat. 3. groupAdmin 4. latestMessage 5. users 6. chatImage 
const chatSchema = new mongoose.Schema({
    chatName: { type: String, default: mongoose.Types.ObjectId, ref: "User" },
    isGroupChat: { type: Boolean, default: false },
    groupAdmin: { type: mongoose.Types.ObjectId, ref: "User" },
    latestMessage: { type: mongoose.Types.ObjectId, ref: "Message" },
    users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    chatPicture: { type: String, default: mongoose.Types.ObjectId, ref: "User", trim: true, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEeF6yBmIjanBabY2MxHEGIt1Oh8ZR1Wo-zXZP4SbQyw&s' },
}, { timestamps: true })


module.exports = mongoose.model("Chat", chatSchema)