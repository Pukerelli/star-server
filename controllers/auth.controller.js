const User = require('../models/user')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

const AuthController = {
    registration: async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.json({error: 'missed fields'})
            }
            const {username, email, password} = req.body
            const checkUsername = await User.findOne({username: username.toLowerCase()})
            const checkEmail = await User.findOne({email: email.toLowerCase()})
            if (checkUsername) {
                return res.json({error: 'username is already taken'})
            }
            if (checkEmail) {
                return res.json({error: 'email is already taken'})
            }
            const hashPassword = await bcrypt.hash(password, 4)
            const id = Date.now()
            const data = await new User({
                username: username.toLowerCase(),
                email: email.toLowerCase(), password: hashPassword,
                id
            })
            await data.save()
            const token = jwt.sign({_id: data._id}, config.get('secretKey'), {expiresIn: '1h'})
            return res.status(200).json({
                data: username.toLowerCase(),
                token,
                message: 'success'
            })
        } catch {
            res.status(500)
        }
    },
    login: async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.json({error: 'missed fields', ...errors})
            }
            const {username, password} = req.body

            const data = await User.findOne({username: username.toLowerCase()})
            if (!data) {
                return res.json({error: "username not found"})
            }
            const isPasswordValid = await bcrypt.compareSync(password, data.password)
            if (!isPasswordValid) {
                return res.json({error: 'invalid password'})
            }
            const token = jwt.sign({_id: data._id}, config.get('secretKey'), {expiresIn: '72h'})
            return res.status(200).json({
                token,
                data: data.username,
                message: 'success'
            })
        } catch (e) {
            res.status(500)
        }
    },
    me: async (req, res) => {
        try {
            const data = await User.findOne({_id: req.user._id}, err => {
                if(err){
                    res.status(500)
                }
            })
            const token = jwt.sign({_id: data._id}, config.get('secretKey'), {expiresIn: '72h'})
            return res.status(200).json({
                token,
                data,
                message: 'success',
            })
        } catch {
            res.status(500)
        }
    }
}

module.exports = AuthController