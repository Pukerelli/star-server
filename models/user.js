const {Schema, model} = require('mongoose')

const User = new Schema({
    id: Number,
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    fullName: String,
    age: String,
    cars: Array,
    address: {
        city: String,
        country: String
    },
    contacts: {
        telegram: String,
        whatsapp: String
    },
    photo: String,
    backgroundPhoto: String,
    drivingExperience: String,
    followedBy: Array,
    following: Array,
    followingCars: Array
})

User.index({ username: 'text', fullName: 'text'});

module.exports = model('User', User)