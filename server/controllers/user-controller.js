const asyncHandler = require("express-async-handler")
const { StatusCodes } = require("http-status-codes")
const bcrypt = require('bcrypt')
const generateToken = require("../config/generateToken")
const User = require("../model/user-model")

const registerUser = asyncHandler(async(req, res) => {
    if (!req.body.userName) {
        req.body.userName = req.body.name.trim().replace(" ", "_")
    }
    const user = await User.create(req.body)
    res.status(200).json({ _id: user._id, name: user.name, email: user.email, userName: user.userName, picture: user.picture, createdAt: user.createdAt, updatedAt: user.updatedAt })
})

const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please enter all fields" })
            // throw new Error({ msg: "Please enter all fields" })
    }
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({ _id: user._id, name: user.name, email: user.email, userName: user.userName, picture: user.picture, createdAt: user.createdAt, updatedAt: user.updatedAt, token: generateToken(user._id, user.name, user.email) })
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Incorrect email or password" })
            // throw new Error({ msg: "Incorrect email or password" })
    }

})

const getAllUser = asyncHandler(async(req, res) => {
    const keyword = req.query.search ? {
        $or: [{ name: { $regex: req.query.name, $option: i } }, { email: { $regex: req.query.email, $option: i } }, { userName: { $regex: req.query.userName, $option: i } }]
    } : {}
    const findUsers = await User.find(keyword).find({ _id: { $ne: req.userInfo.id } })
    res.status(StatusCodes.OK).json({ nbHIts: findUsers.length, findUsers })
})

const findForgetPassUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const updatePass = await User.findOneAndUpdate({ email }, { password: passwordHash }, { new: true, runValidators: true })
    if (!updatePass) {
        res.status(StatusCodes.BAD_REQUEST).send({ msg: "Password Update failed!" })
    }
    // res.status(StatusCodes.OK).json({updatePass})
    res.status(StatusCodes.OK).json({ msg: "updated", updatePass })

})

const updateUserName = asyncHandler(async(req, res) => {
    const { userName } = req.body
    const newUserName = await User.findOneAndUpdate({ _id: req.userInfo.id }, { userName }, { new: true, runValidators: true }).select("-password")
    if (!newUserName) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "username update unsuccessful!" })
    }
    res.status(StatusCodes.OK).json(newUserName)
})

const updatePicture = asyncHandler(async(req, res) => {
    const { picture } = req.body
    const newPicture = await User.findOneAndUpdate({ _id: req.userInfo.id }, { picture }, { new: true, runValidators: true }).select("-password")
    if (!newUserName) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "username update unsuccessful!" })
    }
    res.status(StatusCodes.OK).json(newPicture)
})

module.exports = { registerUser, authUser, getAllUser, findForgetPassUser, updateUserName, updatePicture }