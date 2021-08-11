const Router = require('express')
const User = require('../models/user')
const UserController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = new Router()


router.get('/get/user/:username', UserController.user)

router.put('/put/user/update', authMiddleware, UserController.updateProfile)

router.post('/post/user/update/photo', authMiddleware, UserController.updatePhoto)

router.get('/get/user/list/following', authMiddleware, UserController.followedUsers)

router.post('/post/user/follow', authMiddleware, UserController.followUser)

router.put('/put/user/unfollow',authMiddleware, UserController.unfollowUser)

router.get('/get/user/list/search', UserController.search)

module.exports = router