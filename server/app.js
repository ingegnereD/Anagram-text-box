const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const chatRoute = require('./routes/chat-route')
const userRoute = require('./routes/user-route')
const mssgRoute = require('./routes/mssg-route')
require('colors')
require('dotenv').config()
const app = express()
app.use(express.json())


//routes
app.use("/api/auth", userRoute)
app.use("/api/chat", chatRoute)
app.use("/api/mssg", mssgRoute)

const start = async() => {
    const PORT = process.env.PORT || 5500
    try {
        await connectDB()
        app.listen(PORT, console.log(`Server started and running on port ${PORT}`.cyan.bold))
    } catch (err) {
        console.log(err);
    }
}

start()