const express = require('express')
const config = require('config')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth.router')
const userRouter = require('./routes/user.router')
const carRouter = require('./routes/car.router')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/profile', userRouter)
app.use('/api/cars', carRouter)


const start = async () => {
    try {
        await mongoose.connect(config.get('dbUrl'))
        app.listen(process.env.PORT || 5000, () => {
            console.log(`server started on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()