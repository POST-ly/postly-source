const log = console.log
const mongoose = require('mongoose')

/**
 * "name": 
 */
let EnvSchema = new mongoose.Schema({
    name: String,
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team"},
    EnvId: mongoose.Schema.Types.ObjectId,
    vars: [ mongoose.Schema.Types.Mixed ]
})

module.exports = mongoose.model('Env', EnvSchema)



