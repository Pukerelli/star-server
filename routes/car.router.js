const Router = require('express')
const {check} = require('express-validator')
const CarController = require('../controllers/car.controller')
const authMiddleware = require('../middlewares/auth.middleware')


const router = new Router()

router.get('/get/cars/:username', CarController.cars)

router.get('/get/current/:carname', CarController.current)

router.post('/post/add',
    [
        check('name', 'incorrect name').isLength({min: 3, max: 10}),
        check('brand', 'incorrect brand').isLength({min: 3, max: 15}),
        check('model', 'incorrect model').isLength({min: 3, max: 20}),

    ], authMiddleware, CarController.add
)

router.put('/put/update/car', CarController.update)

router.put('/put/update/photo', CarController.updatePhoto)

router.delete('/delete/car/:carname', CarController.deleteCar)

router.get('/get/search', CarController.search )

router.get('/get/follow/:username', CarController.following)

router.post('/post/follow', authMiddleware, CarController.follow)

router.put('/put/unfollow', authMiddleware, CarController.unfollow)

router.post('/post/note', CarController.addNote)

router.get('/get/note/:id', CarController.note)

router.put('/put/note/change', CarController.changeNote)

router.put('/put/note', CarController.deleteNote)

module.exports = router