const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leaderSchema = new Schema({
    name: {
        type: String,
        requried: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

var Leaders = mongoose.model('Leader', leaderSchema)

module.exports = Leaders