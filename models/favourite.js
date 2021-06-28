const mongoose = require('mongoose')
const Schema = mongoose.Schema

const favouriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {
    timestamps: true
})

var Favourite = mongoose.model('Favourite', favouriteSchema)

module.exports = Favourite