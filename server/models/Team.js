const log = console.log
const mongoose = require('mongoose')

let TeamSchema = new mongoose.Schema({
    name: String,
    teamId: mongoose.Schema.Types.ObjectId,
    collections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection"
    }],
    users: [{
        role: String, 
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }]
})

module.exports = mongoose.model('Team', TeamSchema)

