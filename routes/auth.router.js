const Router = require('express')
const {check} = require('express-validator')
const authMiddleware = require('../middlewares/auth.middleware')
const AuthController = require("../controllers/auth.controller");


const router = new Router()

router.post('/post/registration',
    [
        check('email', 'incorrect email').isEmail(),
        check('password', 'password must be longer than 6 and less than 15').isLength({min: 6, max: 15}),
        check('username', 'username must be longer than 4 and less than 10').isLength({min: 4, max: 10})
    ], AuthController.registration)

router.post('/post/login',
    [
        check('username', 'missed username').isLength({min: 1}),
        check('password', 'missed password').isLength({min: 1})
    ],
    AuthController.login
)

router.get('/get/auth', authMiddleware, AuthController.me)

module.exports = router