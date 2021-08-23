const {Schema, model} = require('mongoose')

const Car = new Schema({
    id: Number,
    name: {type: String, required: true, unique: true},
    owner: {type: String, required: true, ref: 'User'},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    generation: String,
    year: String,
    photo: String,
    doors: String,
    color: String,
    engine: String,
    hp: String,
    mileage: String,
    location: String,
    rims: String,
    ownTime: String,
    followedBy: Array,
    notes: [{title: String, date: String, description: String, carname: String}]
})
Car.index({
    name: 'text', owner: 'text', brand: 'text', model: 'text',
    generation: 'text', location: 'text', engine: 'text'
});


module.exports = model('Car', Car)

