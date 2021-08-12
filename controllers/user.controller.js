const User = require('../models/user')

const UserController = {
    user: async (req, res) => {
        try {
            const username = req.params.username
            const data = await User.findOne({username: username})
            if (!data) {
                return res.json({error: 'user not found'})
            }
            return res.status(200).json({data, message: 'success'})
        } catch {
            res.status(500)
        }
    },
    updateProfile: async (req, res) => {
        try {
            await User.findOneAndUpdate({_id: req.user._id}, {
                fullName: req.body.fullName,
                age: req.body.age,
                drivingExperience: req.body.drivingExperience,
                address: {
                    country: req.body.country,
                    city: req.body.city
                },
                contacts: {
                    whatsapp: req.body.whatsapp,
                    telegram: req.body.telegram
                },
            }, async (err) => {
                if (err) {
                    return res.json({error: err})
                } else {
                    const data = await User.findOne({_id: req.user._id})
                    return res.status(200).json({data, message: 'success'})
                }
            })
        } catch {
            res.status(500)
        }
    },
    updatePhoto: async (req, res) => {
        try {
            const update = req.body
            await User.findOneAndUpdate({_id: req.user._id}, {...update}, async (err) => {
                if (err) {
                    return res.json({error: err})
                } else {
                    const data = await User.findOne({_id: req.user._id})
                    return res.json({
                        data: {
                            photo: data.photo,
                            backgroundPhoto: data.backgroundPhoto
                        },
                        message: 'success'
                    })
                }
            })
        } catch {
            res.status(500)
        }
    },
    followedUsers: async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user._id})
            const data = await User.find({followedBy: user.username})
            console.log(data)
            return res.status(200).json({
                data,
                message: 'success'
            })
        } catch {
            res.status(500)
        }
    },
    followUser: async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user._id})
            await User.findOneAndUpdate({username: req.body.payload}, {
                $addToSet: {followedBy: user.username}
            }, async (err, result) => {
                if (err)
                    return res.json({error: err})
                else {
                    await User.findOneAndUpdate({_id: req.user._id}, {
                        $addToSet: {following: req.body.payload}
                    })
                    result.followedBy.push(user.username)
                    const data = result
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
    unfollowUser: async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user._id})
            await User.findOneAndUpdate({username: req.body.payload}, {
                $pull: {followedBy: user.username}
            }, async (err) => {
                if (err) {
                    return res.json({error: err})
                } else {
                    await User.findOneAndUpdate({_id: req.user._id}, {
                        $pull: {following: req.body.payload}
                    })
                }
                const data = await User.findOne({username: req.body.payload})
                return res.status(200).json({
                    data,
                    message: 'success'
                })
            })
        } catch {
            res.status(500)
        }
    },
    search: async (req, res) => {
        try {
            const search = req.query.search
            search.toLowerCase()
            let data = {}
            if (search === '') {
                data = await User.find({})
            } else {
                data = await User.find({
                    $or:
                        [
                            {username: {$regex: search, $options:'i'}},
                            {fullName: {$regex: search, $options:'i'}}
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

    }
}

module.exports = UserController