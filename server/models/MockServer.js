const log = console.log
const mongoose = require('mongoose')

let MockServerSchema = new mongoose.Schema({
    name: String,
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    MockServerId: mongoose.Schema.Types.ObjectId,
    endpoints: [ mongoose.Schema.Types.Mixed ]
})

module.exports = mongoose.model('MockServer', MockServerSchema)



