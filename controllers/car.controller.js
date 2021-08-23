const {validationResult} = require('express-validator')
const Car = require('../models/cars')
const User = require('../models/user')
const helpers = require("../common/functions");


const CarController = {
    cars: async (req, res) => {
        try {
            const owner = req.params.username
            const user = await User.findOne({username: owner})
            if (!user) {
                return res.json({error: 'not found'})
            }
            const data = await Car.find({owner})
            return res.status(200).json({
                data,
                message: 'success'
            })
        } catch {
            res.status(500)
        }
    },
    current: async (req, res) => {
        try {
            const carname = req.params.carname
            const data = await Car.findOne({name: carname})
            if (!data) {
                return res.json({
                    error: 'car not found'
                })
            }
            return res.status(200).json({
                data,
                message: 'success'
            })

        } catch {
            res.status(500)
        }
    },
    add: async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.json({error: errors})
            }
            const request = helpers.dataAddressTransform(req.body)
            const values = helpers.toLowerCaseTransform(request)
            const user = await User.findOneAndUpdate({_id: req.user._id}, {
                $addToSet: {cars: values.name}
            })
            const owner = user.username
            const checkName = await Car.findOne({name: values.name})
            if (checkName) {
                return res.json({error: 'name is already taken'})
            }
            const id = Date.now()
            const car = await new Car(
                {
                    ...values,
                    owner,
                    id
                })
            await car.save()
            return res.json({
                data: true,
                message: 'success'
            })
        } catch {
            res.status(500)
        }
    },
    update: async (req, res) => {
        try {
            const request = helpers.dataAddressTransform(req.body)
            const update = helpers.toLowerCaseTransform(request)
            await Car.findOneAndUpdate({name: update.name}, {...update},
                async (err) => {
                    if (err) {
                        return res.json({error: err})
                    } else {
                        const data = await Car.findOne({name: update.name})
                        return res.status(200).json({
                            data,
                            message: 'success'
                        })
                    }
                })
        } catch {
            res.status(500)
        }
    },

    updatePhoto: async (req, res) => {
        try {
            await Car.findOneAndUpdate({name: req.body.carName}, {
                photo: req.body.photo
            }, async (err) => {
                if (err) {
                    return res.json({error: err})
                } else {
                    const data = await Car.findOne({name: req.body.carName})
                    return res.json({
                        data,
                        message: 'success'
                    })
                }
            })
        } catch {
            res.status(500)
        }
    },
    deleteCar: async (req, res) => {
        const carname = req.params.carname
        try {
            const data = await Car.findOneAndDelete({name: carname})
            return res.status(200).json({
                data,
                message: 'success'
            })
        } catch {
            res.status(500)
        }
    },
    following: async (req, res) => {
        try {
            const data = await Car.find({followedBy: req.params.username})
            return res.status(200).json({
                data,
                message: 'success'
            })
        } catch {
            res.status(500)
        }
    },
    follow: async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user._id})
            await Car.findOneAndUpdate({name: req.body.payload}, {
                $addToSet: {followedBy: user.username}
            }, async (err) => {
                if (err)
                    return res.json({error: err})
                else {
                    await User.findOneAndUpdate({_id: req.user._id}, {
                        $addToSet: {followingCars: req.body.payload}
                    })
                    const data = await Car.findOne({name: req.body.payload})
                    return res.status(200).json({
                        data,
                        message: 'success',
                    })
                }
            })
        } catch {
            res.status(500)
        }
    },
    unfollow: async (req, res) => {
        try {
            const carname = req.body.payload
            const user = await User.findOne({_id: req.user._id})
            await Car.findOneAndUpdate({name: carname}, {
                $pull: {followedBy: user.username}
            }, async (err) => {
                if (err) {
                    return res.json({error: err})
                } else {
                    await User.findOneAndUpdate({_id: req.user._id}, {
                        $pull: {followingCars: req.body.payload}
                    })
                    const data = await Car.findOne({name: carname})
                    return res.status(200).json({
                        data,
                        message: 'success',
                    })
                }
            })
        } catch {
            res.status(500)
        }
    },
    search: async (req, res) => {
        const search = req.query.search
        try {
            let data = {}
            if (search === '') {
                data = await Car.find({}).limit(50)
            } else {
                data = await Car.find({
                    $or:
                        [
                            {name: {$regex: search, $options:'i'}},
                            {owner: {$regex: search, $options:'i'}},
                            {brand: {$regex: search, $options:'i'}},
                            {model: {$regex: search, $options:'i'}},
                            {generation: {$regex: search, $options:'i'}},
                        ]
                })
            }
            return res.status(200).json({
                data,
                message: 'success'
            })
        } catch {
            res.status(500)
        }
    },
    note: async (req, res) => {
        try {
            const _id = req.params.id
            const data = await Car.findOne({'notes._id': _id}, {"notes.$": 1, 'owner': 1, '_id': 0})
            if (!data)
                return res.json({error: 'not found'})

            const {title, description, date, carname} = data.notes[0]
            return res.status(200).json({
                data: {
                    owner: data.owner,
                    title,
                    description,
                    date,
                    carname
                },
                message: 'success'
            })
        } catch {
            res.status(500)
        }
    },
    addNote: async (req, res) => {
        try {
            const {title, date, description, _id} = req.body
            const car = await Car.findOne({_id})
            if (!title || !date || !description || !_id)
                return res.json({error: 'missed fields'})
            await Car.findOneAndUpdate({_id}, {
                $addToSet: {notes: {title, date, description, carname: car.name}}
            })
            return res.status(200).json({data: true, message: 'success'})
        } catch {
            res.status(500)
        }
    },
    changeNote: async (req, res) => {
        try {
            await Car.updateOne({'notes._id': req.body._id}, {
                '$set': req.body.title ? {
                    'notes.$.title': req.body.title,
                    'notes.$.description': req.body.description
                } : {
                    'notes.$.description': req.body.description
                }
            }, async err => {
                if (err) {
                    res.json({error: err})
                } else {
                    const data = await Car.findOne({'notes._id': req.body._id}, {"notes.$": 1, 'owner': 1, '_id': 0})
                    const {title, description, date, carname} = data.notes[0]
                    return res.status(200).json({
                        data: {
                            owner: data.owner,
                            title,
                            description,
                            date,
                            carname
                        },
                        message: 'success'
                    })
                }
            })

        } catch {
            res.status(500)
        }
    },
    deleteNote: async (req, res) => {
        try {
            const _id = req.body._id
            const car = req.body.car
            await Car.findOneAndUpdate({_id: car}, {$pull: {notes: {_id}}}, async (err) => {
                if (err) {
                    return res.json({error: err})
                } else {
                    return res.status(200).json({
                        data: _id,
                        message: 'success',
                    })
                }
            })
        } catch {
            res.status(500)
        }
    }
}
module.exports = CarController


