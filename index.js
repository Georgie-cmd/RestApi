require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const router = require('./router/user-router')
const errorMiddleware = require('./middleware/error-middleware')
const rateLimiter = require('express-rate-limit')


const PORT = process.env.PORT || 1911
const app = express()

/* This is a rate limiter middleware that limits the number of requests that can be made to the API. */
const apiLimiter = rateLimiter({
	windowMs: 2000,
	max: 13, 
    message: {
        code: 429,
        message: 'You sent too many requests. Please wait a while then try again'
    },
	standardHeaders: true, 
	legacyHeaders: false, 
})


app.use(express.json()) //parsing the request body as JSON
app.use(cookieParser()) //our cookies
app.use(cors()) //allows the API to be accessed from any domain
app.use('/testing', apiLimiter, router)
app.use(errorMiddleware)


const getStarted = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        
        app.listen(PORT, () => {
            console.log(`Server has been started on port: ${PORT}...`)
        })
    } catch(err) {
        console.log('Error:', err)
    }
}
getStarted()